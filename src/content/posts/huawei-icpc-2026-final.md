---
title: ICPC 2026 Huawei Online Challenge：邊雲協同排程競賽復盤
published: 2026-09-07
description: 'ICPC 2026 Online Challenge 1 powered by Huawei：Edge-Cloud Collaborative Scheduling 的最終排名、真正最終提交源碼、迭代路線、評分模型與實作思考。'
image: '/assets/images/huawei-icpc-2026-final-standings.webp'
tags: [ICPC, Huawei, Codeforces, Scheduling, Optimization, C++, Edge Cloud]
category: 'Competition'
draft: false
lang: 'zh_TW'
---

這篇文章記錄我在 **ICPC 2026 Online Challenge 1 powered by Huawei** 中，針對 Codeforces 2251A **Edge-Cloud Collaborative Scheduling** 所做的一整套優化過程。

最後結果：

- Codeforces Handle：`al1swedel`
- 官方最終分數：**16661.204**
- Final standings：**全球第 15 名**
- 本文歸檔的真正最終提交源碼：`CF2251A_FINAL_16661_204.cpp`

> **版本說明（非常重要）**：本文所稱「最終版本」，只指這次附上的、其 22 個 Judgement Protocol 分數合計為 **16661.204179914599** 的源碼。Codeforces 將其顯示為 **16661.204**。`T207_C6_PN25_FLY20_C5F4_SUBMIT.cpp` 是我在後期迭代中保存的一個重要內部版本，但**不是這篇文章所歸檔的最終提交源碼**。為避免內部版本名和官方最終提交互相污染，後文會把兩者明確分開。

這不是一個「找到某個神奇公式就結束」的題目。真正困難的是：同一個調度器要同時處理吞吐、延遲、不同階段的批處理收益、邊緣與雲端資源、請求到達波形，以及各測試點完全不同的權重。後期的工作因此逐漸從「寫一個 heuristic」變成「建立模擬器、做診斷、維護回歸集合，再一刀一刀地改策略」。

## 最終排名

![ICPC 2026 Huawei Online Challenge Final standings](/assets/images/huawei-icpc-2026-final-standings.webp)

Final standings 中，`al1swedel` 位於第 **15** 名，官方顯示分數為 **16661.204**。

## 先理解評分，而不是先猜調度策略

每個測試點最高 1000 分，本質上由兩部分組成：吞吐收益與等待時間收益。

```text
NormalizedScore = w_tp * norm_tp + w_c * norm_c
Score           = 1000 * NormalizedScore
w_tp + w_c      = 1
```

其中：

- `tp`：所有請求最終輸出 token 數 / 整體模擬時間跨度；
- `norm_tp`：把吞吐從基準 `tp_base` 到目標 `tp_UB` 映射到 `[0, 1]`；
- `TDR`：請求從到達到完成輸入階段的平均時間；
- `TPOT`：相鄰輸出 token 的平均間隔；
- `norm_c`：由 TDR、TPOT 相對各自 SLO 的超標程度得到的延遲分量。

第一個核心結論是：**吞吐不是越大越好。** 當 `norm_tp` 已經接近 1，再把 batch 做得更大，可能只會把 TDR / TPOT 推高，而吞吐分已經沒有額外收益。

所以後來我們不再把問題看作單純的 throughput maximization，而是更接近：

```text
在不破壞吞吐下限的前提下，
動態決定何時湊 batch、何時立即服務、
何時拆分 P-PROC、何時把工作送到 cloud，
並控制每個階段的 backlog 與 token gap。
```

## 第一階段：先把 Judge 變成可以離線研究的系統

早期最大的問題不是「策略不夠強」，而是一次改動之後，我們很難知道它到底改善了什麼。

因此第一個真正有價值的工程工作，是建立一個可以逐分復現官方判分的本地 Judge。它會輸出：

- `tp`
- `mean_tdr`
- `mean_tpot`
- `dist`
- `norm_tp`
- `norm_c`
- 最終 score

有了 Judge，優化才從「提交、等分數、猜」變成可重現實驗。

較早的 `T032` 在 22 個公開測試上的本地總分是：

```text
16383.560324671
```

當時明顯的低分點包括：

```text
#5   487.78
#6   420.91
#10  684.42
#14  415.27
```

這讓問題第一次被拆成具體 cohort，而不是一個總分數字。

## 第二階段：建立統一的請求狀態機

一個 request 並不是「排進某台機器就完事」。它會在多個 stage 中流轉，並可能經過 edge / cloud、傳輸、pre/post processing 與逐 token output。

最終程式內部維護完整 request lifecycle，可以抽象成：

```text
ARRIVE
  ↓
P-PRE
  ↓
network / transfer
  ↓
D-PRE
  ↓
decode / output loop
  ↓
P-PROC
  ↓
D-POST / finalization
  ↓
FIN
```

每個 request 保存 ready time、input length、目前 stage、cloud/edge 歸屬、處理進度、輸出進度等狀態。scheduler 的工作就是根據當下狀態決定下一個事件。

這一步沒有排行榜魔法，但它是後續所有優化的地基。沒有穩定狀態機，任何特殊策略都只是把 bug 換一個位置。

## 第三階段：從 FIFO 走向 score-aware scheduling

之後我們針對不同 stage 定義 priority，而不是整個系統只用一個 FIFO。

核心考量包括：

1. **剩餘服務時間估計**：根據 input length 與曲線估算 stage service cost；
2. **SLO slack**：接近 deadline 的 request 提高優先級；
3. **backlog pressure**：觀察 queue 積壓量與最老 request 的等待時間；
4. **throughput / latency 權重**：由 `w_tp`、`w_c` 決定是否值得等待更大的 batch；
5. **stage-specific ordering**：P-PRE、D-PRE、P-PROC 不共享完全相同的最佳順序。

可以把其中一類決策簡化成：

```cpp
if (batch_not_full) {
    gain = saved_compute_if_wait_for_larger_batch();
    latency_risk = estimate_slo_risk();

    if (gain > latency_risk)
        wait_for_more_requests();
    else
        dispatch_now();
}
```

真正實作更複雜，因為還要處理 arrival 週期、decode 是否 hot、cloud 何時釋放、網路上下行佔用等訊號。

## 第四階段：動態 batching，而不是固定 batch cap

固定 batch size 很容易失敗。

batch 太小：

- compute efficiency 差；
- throughput 上不去；
- `norm_tp` 直接丟分。

batch 太大：

- 為了湊 batch 等太久；
- TDR 變差；
- decode/output 被阻塞後 TPOT 也會變差。

因此後續版本把 batch size 變成 workload class、stage、queue pressure、SLO 與觀測週期共同決定的量。

在一些 cohort 中，系統甚至要經歷：

```text
FILL → STEADY → DRAIN / PRESSURE
```

FILL 階段允許積累工作以提高吞吐，STEADY 維持穩定 WIP，而 backlog 或 token-gap 風險過高時則切到清壓策略。

## 第五階段：P-PROC chunking，保護 TPOT

某些長 P-PROC 工作如果一次吃完整段 compute，會把下一批 hot request 的服務時間向後推。

所以後期程式允許把 P-PROC 拆成 piece：

```text
full P-PROC
████████████████████████

chunked P-PROC
████████  | hot work |  ████████
```

是否切分，不是固定按層數硬砍，而是比較：

- 下一個 guaranteed / hot event 還有多久；
- full processing 需要多久；
- hot request 額外等待造成的 latency cost；
- chunking 帶來的 setup / throughput cost。

這是一個很重要的 trade-off：**寧可犧牲一小段局部 compute efficiency，也不要讓高價值 output gap 爆掉。**

## 第六階段：不要假裝所有測試點來自同一種分布

22 個公開測試在這些維度上差異很大：

- input length 分布；
- arrival pattern；
- edge/cloud concurrency；
- stage curve；
- SLO1 / SLO2；
- `w_tp / w_c`；
- output length 與週期性。

因此後期方案不是「一條萬能公式」，而是：

```text
online observable features
          ↓
workload / mode detection
          ↓
shared scheduling core
          ↓
small number of guarded policy branches
```

關鍵不是 branch 越多越好，而是 **branch 必須有可觀測條件與回歸保護**。如果只是 `if (test_id == 6)`，那不是 scheduler，只是把排行榜寫進程式碼。

## 版本迭代：分數是怎麼一點點擠出來的

幾個保存下來、且有完整 22-case regression 的代表節點：

| 版本 | 22-case 本地分數 | 主要變化 |
|---|---:|---|
| T032 | 16383.5603 | 早期可重現 baseline，暴露 #5/#6/#10/#14 等瓶頸 |
| T066 | 16458.9859 | 固化較穩定的 cohort routing 與 batch/queue 策略 |
| T068 | 16475.1578 | 對 T13/T16 等 cohort 做定向且可回歸的修補 |
| T069 | 16530.7135 | #13 出現明顯局部收益，總分繼續上移 |
| T106 FUSED | ≈16612.5863 | 多條已驗證策略融合，進入後期微調階段 |
| T207 | 後期內部 checkpoint | 保存了 C6 等一批重要後期策略；**不是本文真正 final 源碼** |
| Final submission | **16661.2041799146** | 本文附上的真正最終源碼，對應 Codeforces **16661.204 / Rank 15** |

越到後面，大改越不值錢。

例如 T107 相對 T106 的一次 patch，只動了三個很窄的地方：

```text
#4   +0.184305
#12  +0.891554
#13  +1.279066
----------------
Total +2.354925
```

更重要的是，其他 19 個 case 的 delta = 0。後期真正可靠的工作方式變成：**只改能證明會變好的區域，其他 case 儘可能鎖死。**

## C6：從公開特例到帶 guard 的可觀測策略

C6 是後期最難處理的 cohort 之一。內部版本名曾留下 `PN25`、`FLY20`、cloud-specific FLY 等調整痕跡；真正 final 源碼中則可以看到更完整的兩層設計：

```text
public-context preservation
        +
observable generalized context
        +
fallback / guard
```

也就是說，公開 workload 上保留已驗證的高分行為，同時對相似但非完全相同的 workload 用可觀測條件觸發更保守策略。這比把一串 case fingerprint 硬塞進 if-else 稍微像一個真正的 scheduler。

## Exact Regression：最後真正依賴的工程方法

每次 patch 後，不只看總分，而是跑完整 22-case：

```text
case 1   old → new → delta
case 2   old → new → delta
...
case 22  old → new → delta
```

一個 patch 要進主線，至少要回答：

1. 改善的是哪個 case？
2. 為什麼改善？
3. 是否讓其他 case 退步？
4. 依賴的是 workload 可觀測特徵，還是 public fingerprint？
5. 條件判斷錯誤時，有沒有 fallback？

這讓後期版本雖然越來越複雜，但每一層複雜度至少都有對應的回歸證據。

## 最終提交記錄

![Codeforces submissions of al1swedel](/assets/images/huawei-icpc-2026-submissions.webp)

提交記錄可以看到競賽末期仍然反覆迭代、回退與再驗證。最終有效結果固定在 **16661.204**。

## 真正的最終源碼：這裡再說一次

為博客歸檔，我把你看到的**真正 Codeforces 最終提交源碼**另存為：

**`CF2251A_FINAL_16661_204.cpp`**

- 22-case Judgement Protocol 合計：**16661.204179914599**
- Codeforces 顯示分數：**16661.204**
- Final standings：**#15**
- 歸檔檔案大小：**65321 bytes**
- SHA-256：`03f8bea96b0766b23d160ffa16804240d1e66a29b93c14ac61f3c273791dfa38`

這個 hash 綁定的是本文附上的 final source，不是之前的 `T207` 檔案。

前幾行如下：

```cpp
#include<bits/stdc++.h>
#define R0 return
#define X int
#define Y auto
#define Z max
#define W min
#define O bool
#define H abs
#define T to_string
```

後面的程式已經為提交尺寸與迭代速度做了大量壓縮，閱讀感受接近直接盯著一堵 AST 牆。正文不再複製 65 KB 的單行壓縮源碼；本文保存其校驗值與完整 Judgement Protocol，避免把其他內部版本誤認成 final。

## 最終 Judgement Protocol

這份 final source 的 22 個 case 結果如下。這也是它被認定為「真正最終版本」最直接的數值證據。

| Case | Points | tp | mean TDR | mean TPOT |
|---:|---:|---:|---:|---:|
| #1 | 500.000003 | 0.022222 | 30.000000 | 0.000000 |
| #2 | 500.000000 | 0.005755 | 126.158679 | 0.000000 |
| #3 | 500.567967 | 0.003880 | 1329.849832 | 56.462313 |
| #4 | 832.863211 | 0.071298 | 493.337948 | 76.694740 |
| #5 | 518.651126 | 1.340047 | 1497.254452 | 67.292136 |
| #6 | 463.917548 | 0.869552 | 3880.824744 | 60.637259 |
| #7 | 924.498223 | 0.008881 | 858.868074 | 62.657461 |
| #8 | 838.237636 | 0.013495 | 1086.885839 | 98.955170 |
| #9 | 735.942762 | 0.004383 | 5726.290775 | 0.000000 |
| #10 | 684.424557 | 0.007628 | 182521.173882 | 86.964712 |
| #11 | 500.239294 | 0.000007 | 65540728.936072 | 16199.089335 |
| #12 | 806.526300 | 0.000024 | 1280549.638656 | 178.211443 |
| #13 | 822.142160 | 0.030751 | 1714.712378 | 145.324146 |
| #14 | 415.266866 | 0.003564 | 192.489397 | 185.993268 |
| #15 | 888.996971 | 0.000009 | 7303441.029544 | 0.000000 |
| #16 | 981.471475 | 0.029808 | 41824.000072 | 71.703522 |
| #17 | 944.639041 | 0.000520 | 8563137.539103 | 5875.574485 |
| #18 | 916.202899 | 0.000009 | 17713636.295039 | 0.000000 |
| #19 | 960.253914 | 0.717268 | 144.309740 | 142.346375 |
| #20 | 998.203001 | 0.005607 | 1257.782370 | 172.089175 |
| #21 | 972.924403 | 0.012525 | 35870.869792 | 0.000000 |
| #22 | 955.234823 | 39.873266 | 1858.000000 | 6.002148 |

**Total = 16661.204179914599 → Codeforces 顯示 16661.204**

## 實時排名錄影

當時保存的實時排名影片：

<iframe width="100%" height="468" src="https://www.youtube.com/embed/yXFaB-dMkpk" title="ICPC 2026 Huawei Online Challenge 實時排名" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

YouTube：<https://www.youtube.com/watch?v=yXFaB-dMkpk>

## 賽後：研究版本和比賽 final 必須分開

比賽結束後，我仍然繼續做泛化、OOD 與更保守的策略實驗。但這些版本必須和競賽 final 分開記錄。

```text
競賽時間線
T032 → T066 → T068 → T069 → T106 → ... → late checkpoints → FINAL SOURCE
                                                        ↓
                                             16661.204 / #15
                                                        ↓
                                                  contest ends
                                                        ↓
賽後時間線                                      generalization / OOD audit
```

所以本文有一條硬規則：

> **凡是比賽結束後做的 generalized / OOD / distilled 版本，不論本地測試多漂亮，都不回寫成「比賽最終版本」。**

這個區分很重要。否則很容易把「賽後更乾淨的研究程式」誤寫成「當時真正提交的程式」，最後版本史就會變成一場由檔名主導的歷史修正主義。

## 最後留下來的東西

這次 Challenge 最有意思的地方，不只是第 15 名，而是我們最後真的把一個最初靠直覺調參的 heuristic，逐步變成：

```text
可復現 Judge
+ 狀態機
+ score-aware scheduling
+ dynamic batching
+ workload classification
+ guarded specialisation
+ exact regression
+ post-contest OOD audit
```

最後那份約 65 KB、幾乎被壓成一堵牆的 C++ 並不好看，但它保存了整個迭代過程留下來的工程決策。競賽程式有時就是這樣：外表像事故現場，裡面每一條傷痕卻都有來歷。
