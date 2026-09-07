---
title: 'ForgeGuard Nexus：證據驅動的工業維護 Agent 平臺 / Evidenzgetriebene Industrie-Wartungsagenten'
published: 2026-09-07
description: '以繁體中文與德語介紹 ForgeGuard Nexus：從設備證據、診斷與 RUL，到人工審批、工單執行與維修後驗證的工業 AI Agent 閉環。'
tags: [AI, Agents, Industrial AI, Predictive Maintenance, ForgeGuard, Deutsch]
category: 'Projects'
draft: false
lang: 'zh_TW'
---

::github{repo="alaster-t34/ForgeGuard-Nexus"}

# ForgeGuard Nexus

> **Evidence-driven industrial maintenance agents with human-governed execution and post-maintenance verification.**

ForgeGuard Nexus 是我目前持續開發的一個工業 AI Agent 平臺。它關注的並不只是「模型能不能把故障分類對」，而是另一個更接近真實工業現場的問題：**當設備出現異常時，一個系統究竟需要掌握多少證據、約束與流程，才有資格提出可以被人採用的維護決策？**

目前倉庫中的版本以 **ForgeGuard Nexus 5.0** 為主，Release Candidate 為 **v0.7.9**，專案採用 Apache-2.0 License。

專案地址：<https://github.com/alaster-t34/ForgeGuard-Nexus>

---

# 繁體中文

## 1. 為什麼不只做一個「故障分類模型」？

傳統預測性維護系統通常從感測器訊號開始，最後輸出一個故障類別、健康分數，或者剩餘使用壽命（RUL）。這些資訊很重要，但它們離真正的維護決策仍然有一段距離。

假設模型判斷某個軸承存在異常，工程現場接下來仍然要回答很多問題：

- 這批振動訊號本身可靠嗎？是否存在 clipping、dropout、DC offset 或其他品質問題？
- 故障模式到底是什麼？證據之間有沒有衝突？
- RUL 或健康風險是否已經進入需要處置的時間窗？
- 對應的備件是否有庫存？
- 現場是否有具備相應技能的人員？
- 生產排程允許在哪個時間段停機？
- 這項操作是否屬於高風險行為？誰有權批准？
- 維修完成之後，如何證明設備真的恢復，而不是僅僅把工單勾成「完成」？

ForgeGuard Nexus 嘗試把這些問題放進同一個可審計的工作流，而不是把一個分類器外面套上聊天介面，然後就宣布「Agent 化」完成。那種做法很省事，現場通常不會因此變得更安全。

## 2. 從訊號到閉環，而不是從訊號到一句答案

ForgeGuard 的核心流程可以概括為：

```text
Sensor / Edge / CSV input
        ↓
資料品質閘門 + 證據封裝
        ↓
故障診斷 + RUL / 健康風險
        ↓
FMEA + 庫存 + 生產 + 人員工具
        ↓
多方案維護規劃
        ↓
人工授權閘門
        ↓
工單執行
        ↓
維修後重新採集
        ↓
驗證：關閉事件或自動重新開啟
        ↓
審計軌跡 + 可重用知識
```

這裡最重要的一點是：**診斷不是流程終點。**

系統必須繼續處理維護所需的資源與組織約束，產生多個可比較的維護方案，經過人工授權後形成工單；而工單完成也不是終點，還需要重新採集維修後證據，進行後驗驗證。

如果驗證沒有通過，事件可以重新開啟，而不是因為「工程師已經點擊完成」就假設設備一定恢復。

## 3. 13 個角色受限的 Agent

目前 ForgeGuard 實作了 13 個具備角色邊界的 Agent，覆蓋：

1. 資料品質；
2. 感知與訊號分析；
3. 工業知識；
4. 故障診斷；
5. RUL 與風險；
6. 人員安全；
7. 能源與環境；
8. 韌性與異常處理；
9. 維護方案規劃；
10. 治理與授權；
11. 工單；
12. 維修後驗證；
13. 協調與工作流控制。

我更傾向把 Agent 看成「帶有明確責任、工具權限與狀態邊界的工作單元」，而不是讓所有能力都塞進一個萬能對話模型。

這種設計的好處是：哪個步驟使用了什麼證據、調用了什麼工具、由誰批准、最後為什麼關閉事件，都能夠留下可追蹤的路徑。

## 4. 證據品質優先

工業 AI 很容易出現一個尷尬問題：模型本身可能運作正常，但輸入根本不值得相信。

ForgeGuard 因此把資料品質放在工作流前面，對振動訊號檢查例如：

- clipping；
- dropout；
- DC offset；
- 有效解析度；
- 噪聲一致性；
- 相互矛盾的證據。

低品質或矛盾證據不應該被強行壓成一個「確定答案」。系統可以要求重新採集、升級處理或拒絕繼續執行高風險決策。

這是 ForgeGuard 很重要的一條原則：**不知道，就應該允許系統說不知道。**

## 5. 模型只是系統中的一部分

目前系統包含可解釋的時域、頻域與包絡特徵，並提供可在 CPU 上部署的振動基線模型。

倉庫目前記錄的選定部署模型為：

```text
dsp-calibrated-hgb-v0.2
```

在專案生成的 **ForgeGuard OpenEval-RM 0.1.0** 物理啟發式合成回歸資料集上，倉庫中的基準結果包括：

| 指標 | 結果 |
|---|---:|
| Macro-F1 | 0.9342 |
| Balanced Accuracy | 0.9375 |
| CPU p95 Latency | 13.912 ms |
| Abstention 後接受樣本準確率 | 0.9872 |
| Mean Robustness Macro-F1 | 0.7166 |

這些數值的用途是**可重現的回歸與魯棒性驗證**，並不代表真實工廠精度。

這個界線需要非常明確。合成資料、公開資料集、物理試驗臺以及真實工廠證據，應該被分開描述，而不是把不同來源的結果混成一個漂亮但沒有意義的百分比。

## 6. 故障注入與安全行為

除了模型基準之外，ForgeGuard 還包含可重現的軟體／訊號故障注入流程，用來驗證系統在異常條件下是否能做出安全反應。

目前倉庫報告的回歸測試結果包含：

| 檢查 | 結果 |
|---|---:|
| Clean injected-fault classification accuracy | 1.000 |
| Corrupted-signal safe-response rate | 1.000 |
| Workflow-fault containment rate | 1.000 |

同樣，這些結果屬於軟體回歸與安全行為證據，**不是工業現場安全認證，也不是 plant safety case**。

## 7. 人必須留在高風險決策迴路中

ForgeGuard 的定位是決策支援系統，而不是自動接管真實生產設備的控制器。

高風險操作必須經過具備授權的人員批准。系統的安全不變量包括：

- 缺少必要證據時，方案不能直接越過證據閘門；
- 高風險工單不能繞過人工批准；
- 沒有維修後驗證，事件不能直接標記為已解決。

這種限制看起來沒有「完全自治 Agent」那麼科幻，但在工業系統裡，能夠被限制、被審計、被拒絕，通常比「它很自主」更有價值。

## 8. 部署方式

ForgeGuard 不只考慮瀏覽器 Demo，目前倉庫包含多條部署路徑：

- Docker；
- Windows native / desktop launcher；
- Linux native；
- NVIDIA Jetson 邊緣裝置。

Docker 是目前最直接的啟動方式：

```bash
git clone https://github.com/alaster-t34/ForgeGuard-Nexus.git
cd ForgeGuard-Nexus
docker compose -f compose.yaml up -d --build api
```

啟動後可以訪問：

```text
http://localhost:8000
```

健康檢查端點：

```text
http://localhost:8000/api/v1/health
```

## 9. 我真正想解決的問題

ForgeGuard Nexus 最終想做的，不是把更多模型堆到一張架構圖上。

我更關心的是：

**如何讓一個工業 AI 系統知道自己的證據是否可信、知道自己的權限邊界、知道什麼時候必須交給人決策，並且在維修完成後仍然有責任證明設備確實恢復。**

從這個角度看，診斷模型只是閉環中的一個節點。

真正困難的部分是證據、模型、工業知識、資源約束、權限、執行與驗證之間如何連接，而且每一個關鍵決定都能被回溯。

專案仍在迭代，倉庫會繼續保留可重現基準、測試、部署文件與安全邊界：

**GitHub：<https://github.com/alaster-t34/ForgeGuard-Nexus>**

---

# Deutsch

## 1. Warum nicht einfach ein weiteres Fehlklassifikationsmodell?

Klassische Predictive-Maintenance-Systeme beginnen häufig mit Sensordaten und enden mit einer Fehlerklasse, einem Health Score oder einer Schätzung der Remaining Useful Life (RUL). Diese Informationen sind wertvoll, reichen für eine reale Instandhaltungsentscheidung jedoch nicht aus.

Wenn ein Modell beispielsweise einen auffälligen Lagerzustand erkennt, bleiben in der Praxis weitere Fragen offen:

- Sind die Eingangsdaten überhaupt zuverlässig?
- Gibt es Clipping, Dropouts, DC-Offset oder widersprüchliche Signale?
- Welcher Fehlermodus ist wahrscheinlich?
- Liegt das RUL- bzw. Risikofenster bereits in einem kritischen Bereich?
- Ist das notwendige Ersatzteil verfügbar?
- Gibt es qualifiziertes Personal?
- Welches Wartungsfenster ist mit der Produktionsplanung vereinbar?
- Wer darf eine risikoreiche Maßnahme freigeben?
- Und wie wird nach der Wartung nachgewiesen, dass sich der Anlagenzustand tatsächlich verbessert hat?

ForgeGuard Nexus versucht, diese Fragen in einem gemeinsamen, auditierbaren Workflow abzubilden. Ziel ist nicht, einen Klassifikator mit einer Chat-Oberfläche zu versehen und das Ergebnis anschließend als „Agentensystem“ zu verkaufen.

## 2. Von Sensordaten zu einem geschlossenen Wartungskreislauf

Der grundlegende Ablauf lautet:

```text
Sensor / Edge / CSV
        ↓
Datenqualitäts-Gate + Evidenzpaket
        ↓
Fehlerdiagnose + RUL / Gesundheitsrisiko
        ↓
FMEA + Lagerbestand + Produktion + Personal
        ↓
Mehrere Wartungsoptionen
        ↓
Menschliche Freigabe
        ↓
Arbeitsauftrag
        ↓
Erneute Datenerfassung nach der Wartung
        ↓
Verifikation: Vorfall schließen oder erneut öffnen
        ↓
Audit-Trail + wiederverwendbares Wissen
```

Der entscheidende Punkt ist: **Die Diagnose ist nicht das Ende des Prozesses.**

Nach der Diagnose müssen Ressourcen, Sicherheitsregeln und organisatorische Randbedingungen berücksichtigt werden. Erst danach entsteht ein ausführbarer Wartungsplan. Und auch ein abgeschlossener Arbeitsauftrag bedeutet noch nicht automatisch, dass die Maschine wieder gesund ist.

ForgeGuard erfasst deshalb nach der Wartung erneut Evidenz. Wenn die Verifikation fehlschlägt, kann der Vorfall wieder geöffnet werden.

## 3. Dreizehn rollenbegrenzte Agents

Der aktuelle Stand umfasst 13 Agents mit klar abgegrenzten Verantwortlichkeiten. Sie decken unter anderem folgende Bereiche ab:

1. Datenqualität;
2. Wahrnehmung und Signalanalyse;
3. industrielles Wissen;
4. Diagnose;
5. RUL und Risiko;
6. Arbeitssicherheit;
7. Energie und Umwelt;
8. Resilienz und Ausnahmebehandlung;
9. Wartungsplanung;
10. Governance und Freigabe;
11. Arbeitsaufträge;
12. Verifikation nach der Wartung;
13. Koordination des Gesamtworkflows.

Ein Agent ist hier nicht als allwissender Chatbot gedacht, sondern als Arbeitseinheit mit definierten Aufgaben, Werkzeugen, Rechten und Zustandsgrenzen.

Dadurch lässt sich nachvollziehen, welche Evidenz für eine Entscheidung verwendet wurde, welches Werkzeug aufgerufen wurde, wer eine Maßnahme freigegeben hat und warum ein Vorfall geschlossen wurde.

## 4. Datenqualität vor Modellvertrauen

Ein industrielles KI-System kann formal korrekt rechnen und trotzdem eine schlechte Entscheidung treffen, wenn die Eingangsdaten unbrauchbar sind.

ForgeGuard prüft deshalb Vibrationsdaten unter anderem auf:

- Clipping;
- Dropouts;
- DC-Offset;
- effektive Auflösung;
- inkonsistentes Rauschen;
- widersprüchliche Evidenz.

Schlechte oder widersprüchliche Evidenz wird nicht zwangsläufig in eine scheinbar sichere Diagnose gezwungen. Stattdessen kann das System eine erneute Messung verlangen, eskalieren oder die weitere Ausführung blockieren.

Mit anderen Worten: **Unsicherheit ist ein zulässiges Ergebnis.**

## 5. Das Modell ist nur ein Baustein

ForgeGuard enthält interpretierbare Zeit-, Frequenz- und Hüllkurvenmerkmale sowie ein CPU-taugliches Vibrationsmodell.

Das derzeit im Repository ausgewählte Deployment-Modell lautet:

```text
dsp-calibrated-hgb-v0.2
```

Auf dem projektintern erzeugten, physikalisch inspirierten synthetischen Regressionsdatensatz **ForgeGuard OpenEval-RM 0.1.0** sind im Repository unter anderem folgende Werte dokumentiert:

| Metrik | Ergebnis |
|---|---:|
| Macro-F1 | 0.9342 |
| Balanced Accuracy | 0.9375 |
| CPU-p95-Latenz | 13.912 ms |
| Accuracy akzeptierter Samples nach Abstention | 0.9872 |
| Mean Robustness Macro-F1 | 0.7166 |

Diese Zahlen dienen der **reproduzierbaren Regression und Robustheitsprüfung**. Sie sind ausdrücklich nicht als Genauigkeit in einer realen Fabrik zu verstehen.

Synthetische Daten, öffentliche Datensätze, Prüfstandsdaten und reale Betriebsdaten müssen getrennt betrachtet und dokumentiert werden.

## 6. Fault Injection und sicheres Systemverhalten

Neben Modellbenchmarks enthält ForgeGuard reproduzierbare Software- und Signal-Fault-Injection-Tests.

Die aktuell dokumentierten Regressionsergebnisse umfassen:

| Prüfung | Ergebnis |
|---|---:|
| Clean injected-fault classification accuracy | 1.000 |
| Corrupted-signal safe-response rate | 1.000 |
| Workflow-fault containment rate | 1.000 |

Auch hier gilt: Diese Ergebnisse sind Nachweise für Regressionstests und Sicherheitsverhalten der Software. Sie stellen **keine industrielle Sicherheitszertifizierung und keinen Plant Safety Case** dar.

## 7. Menschen bleiben bei risikoreichen Entscheidungen im Regelkreis

ForgeGuard ist ein Decision-Support-System und kein autonomer Controller für reale Produktionsanlagen.

Risikoreiche Aktionen benötigen eine autorisierte menschliche Freigabe. Zu den deterministischen Sicherheitsregeln gehören:

- Ein Plan darf erforderliche Evidenz nicht umgehen.
- Ein risikoreicher Arbeitsauftrag darf die menschliche Freigabe nicht umgehen.
- Ein Vorfall darf ohne Verifikation nach der Wartung nicht endgültig geschlossen werden.

Das klingt weniger spektakulär als ein vollständig autonomer Agent. In industriellen Anwendungen ist ein System, das sich begrenzen, prüfen und im Zweifel stoppen lässt, allerdings meistens nützlicher als eines, das lediglich möglichst autonom wirkt.

## 8. Deployment

Das Repository unterstützt mehrere Deployment-Pfade:

- Docker;
- Windows Native / Desktop Launcher;
- Linux Native;
- NVIDIA Jetson für Edge-Szenarien.

Der schnellste Einstieg erfolgt über Docker:

```bash
git clone https://github.com/alaster-t34/ForgeGuard-Nexus.git
cd ForgeGuard-Nexus
docker compose -f compose.yaml up -d --build api
```

Danach ist der Dienst standardmäßig unter folgender Adresse erreichbar:

```text
http://localhost:8000
```

Health Endpoint:

```text
http://localhost:8000/api/v1/health
```

## 9. Das eigentliche Ziel

Das Ziel von ForgeGuard Nexus besteht nicht darin, möglichst viele KI-Modelle in ein Architekturdiagramm zu packen.

Mich interessiert vielmehr folgende Frage:

**Wie kann ein industrielles KI-System erkennen, ob seine Evidenz vertrauenswürdig ist, seine eigenen Berechtigungsgrenzen respektieren, bei Bedarf einen Menschen einbeziehen und nach einer Wartung nachweisen, dass die Anlage tatsächlich wieder in einem akzeptablen Zustand ist?**

Aus dieser Perspektive ist das Diagnosemodell nur ein Knoten in einem wesentlich größeren Kreislauf.

Die schwierigere Aufgabe besteht darin, Evidenz, Modelle, FMEA-Wissen, Ressourcen, Produktionsbedingungen, Berechtigungen, Ausführung und Verifikation so miteinander zu verbinden, dass jede wichtige Entscheidung nachvollziehbar bleibt.

Der Quellcode, die reproduzierbaren Benchmarks, Deployment-Dokumentation und Sicherheitsgrenzen befinden sich im Repository:

**GitHub: <https://github.com/alaster-t34/ForgeGuard-Nexus>**
