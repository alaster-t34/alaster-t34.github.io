---
title: linux命令帮助信息
published: 2024-12-30
description: '查看Linux命令幫助信息'
image: ''
tags: [Linux,linux命令]
category: 'Linux'
draft: false 
lang: ''
---

---

title: Linux 命令幫助資訊
published: 2024-12-30
description: '查看 Linux 命令幫助資訊：help、--help、man、info、whatis、apropos 等工具整理'
image: ''
tags: [Linux, linux命令, CLI, Help]
category: 'Linux'
draft: false
lang: 'zh-TW'
-------------

# Linux 命令幫助資訊

在 Linux 裡，真正可靠的老師其實就在終端機裡。

當你忘記一個命令怎麼用、某個參數是什麼意思、設定檔在哪裡，或者只是想快速確認一個工具是否存在時，不一定要立刻去搜尋網頁。Linux 本身已經提供了很多查詢命令幫助資訊的方法。

這篇會整理常見的 Linux 命令幫助查詢工具：

* `help`
* `--help`
* `man`
* `info`
* `whatis`
* `apropos`
* `type`
* `which`
* `whereis`

把它們學會之後，你就可以在終端機裡建立自己的「命令說明書地圖」。

---

## 快速總覽

| 工具               | 適合場景           | 範例                |
| ---------------- | -------------- | ----------------- |
| `command --help` | 快速查看命令用法與參數    | `ls --help`       |
| `help`           | 查看 Shell 內建命令  | `help cd`         |
| `man`            | 查看完整手冊頁        | `man ls`          |
| `info`           | 查看 GNU info 文件 | `info coreutils`  |
| `whatis`         | 用一句話理解命令       | `whatis grep`     |
| `apropos`        | 根據關鍵字搜尋相關命令    | `apropos network` |
| `type`           | 判斷命令來源         | `type cd`         |
| `which`          | 找可執行檔路徑        | `which python`    |
| `whereis`        | 找命令、源碼、man 頁   | `whereis bash`    |

---

## 1. 使用 `--help`

大部分 Linux 命令都支援 `--help` 參數。它通常會列出基本語法、常用選項和簡短說明。

```bash
ls --help
cp --help
grep --help
```

`--help` 的優點是很快，適合用來查詢「我只是忘了某個參數」的情況。

例如你忘了 `ls` 的排序參數，可以這樣查：

```bash
ls --help | grep sort
```

也可以配合 `less` 慢慢看：

```bash
ls --help | less
```

---

## 2. 使用 `help`

`help` 主要用來查看 Shell 內建命令。

有些命令不是外部程式，而是 Shell 自己提供的功能，例如：

* `cd`
* `alias`
* `export`
* `echo`
* `history`
* `jobs`
* `fg`
* `bg`

這些命令適合用 `help` 查：

```bash
help cd
help alias
help export
```

如果想列出所有 Bash 內建命令，可以直接輸入：

```bash
help
```

---

## 3. 為什麼 `cd --help` 有時不好用？

因為 `cd` 通常是 Shell builtin，也就是 Shell 內建命令。它不是一般的外部可執行程式。

所以查 `cd` 的時候，比起：

```bash
cd --help
```

更推薦：

```bash
help cd
```

你也可以先用 `type` 看看命令到底是什麼：

```bash
type cd
```

可能會看到：

```text
cd is a shell builtin
```

---

## 4. 使用 `man`

`man` 是 manual 的縮寫，也就是 Linux 的手冊頁系統。

基本用法：

```bash
man ls
man grep
man bash
```

進入 `man` 頁後，常用按鍵如下：

| 按鍵         | 功能      |
| ---------- | ------- |
| `Space`    | 往下翻一頁   |
| `b`        | 往上翻一頁   |
| `q`        | 離開      |
| `/keyword` | 搜尋關鍵字   |
| `n`        | 下一個搜尋結果 |
| `N`        | 上一個搜尋結果 |

例如在 `man grep` 裡搜尋 `recursive`：

```text
/recursive
```

---

## 5. man 手冊章節

`man` 不只可以查命令，也可以查系統呼叫、C 函式、設定檔格式等內容。

常見章節如下：

| 章節 | 內容       |
| -- | -------- |
| 1  | 使用者命令    |
| 2  | 系統呼叫     |
| 3  | C 函式庫    |
| 4  | 裝置與特殊檔案  |
| 5  | 設定檔格式    |
| 6  | 遊戲       |
| 7  | 慣例、協定與概念 |
| 8  | 系統管理命令   |

有些名稱在不同章節裡可能代表不同內容。

例如：

```bash
man 1 printf
man 3 printf
```

`man 1 printf` 查的是命令，`man 3 printf` 查的是 C 語言函式。

---

## 6. 使用 `info`

`info` 是 GNU 系統常見的文件格式。它通常比 `man` 更詳細，內容更像一本完整教材。

```bash
info coreutils
info grep
info bash
```

`info` 適合用來深入理解 GNU 工具，例如：

* `coreutils`
* `grep`
* `sed`
* `awk`
* `bash`

常用按鍵：

| 按鍵  | 功能   |
| --- | ---- |
| `n` | 下一節  |
| `p` | 上一節  |
| `u` | 回上一層 |
| `q` | 離開   |
| `/` | 搜尋   |

如果你只是查一個參數，`--help` 或 `man` 會比較快；如果你想系統學習某個工具，`info` 更適合。

---

## 7. 使用 `whatis`

`whatis` 可以用一句話描述某個命令。

```bash
whatis ls
whatis grep
whatis tar
```

輸出可能像這樣：

```text
ls (1) - list directory contents
grep (1) - print lines that match patterns
tar (1) - an archiving utility
```

如果你只是想知道「這個命令是幹嘛的」，`whatis` 很方便。

---

## 8. 使用 `apropos`

如果你不知道命令名稱，只知道自己想做什麼，可以用 `apropos` 根據關鍵字搜尋。

```bash
apropos copy
apropos compress
apropos network
apropos password
```

例如你想找和網路相關的工具：

```bash
apropos network
```

想找和壓縮相關的工具：

```bash
apropos archive
```

`apropos` 很適合用在「我知道需求，但忘了命令名稱」的情況。

---

## 9. 使用 `type`

`type` 可以告訴你一個命令到底是：

* alias
* Shell builtin
* function
* 外部可執行檔

例如：

```bash
type ls
type cd
type ll
type python
```

可能看到：

```text
ls is aliased to `ls --color=auto`
cd is a shell builtin
python is /usr/bin/python
```

在查幫助文件前，先用 `type` 看一下命令來源，通常可以少走很多彎路。

---

## 10. 使用 `which`

`which` 可以告訴你輸入某個命令時，系統實際會執行哪個檔案。

```bash
which bash
which python
which git
```

例如：

```bash
which python
```

可能輸出：

```text
/usr/bin/python
```

這表示目前執行的 `python` 來自 `/usr/bin/python`。

---

## 11. 使用 `whereis`

`whereis` 會搜尋命令相關的 binary、source 和 manual page。

```bash
whereis bash
whereis gcc
whereis ssh
```

範例輸出：

```text
bash: /usr/bin/bash /usr/share/man/man1/bash.1.gz
```

簡單理解：

* `which`：我執行的是哪一個檔案？
* `whereis`：系統裡有哪些和它相關的檔案？

---

## 12. 常用查詢流程

遇到陌生命令時，可以照這個順序查：

```bash
type command
command --help
man command
whatis command
apropos keyword
```

如果是 Shell 內建命令：

```bash
type command
help command
```

如果是 GNU 大型工具：

```bash
info command
```

---

## 13. 實戰例子：查 `tar`

先用 `whatis` 看一句話說明：

```bash
whatis tar
```

再看快速參數：

```bash
tar --help | less
```

再看完整手冊：

```bash
man tar
```

如果你想找 gzip 相關內容，可以在 `man tar` 裡搜尋：

```text
/gzip
```

---

## 14. 實戰例子：查 `grep`

```bash
whatis grep
grep --help | grep -i color
man grep
info grep
```

這樣可以分層查詢：

* `whatis grep`：先知道它是什麼
* `grep --help`：快速找參數
* `man grep`：查看正式文件
* `info grep`：深入學習完整說明

---

## 15. 實戰例子：查 `cd`

`cd` 是 Shell 內建命令，所以不要只依賴 `man cd`。

推薦：

```bash
type cd
help cd
```

因為不同 Shell 的 `cd` 行為可能不同。例如 Bash、Zsh、Fish 都可能有自己的細節。

---

## 16. 小抄 Cheat Sheet

```bash
# 查 Shell 內建命令
help cd

# 查命令快速說明
ls --help

# 查完整手冊
man ls

# 在 man 裡搜尋關鍵字
/pattern

# 查一句話說明
whatis ssh

# 根據關鍵字找相關命令
apropos network

# 看命令來源
type python

# 找可執行檔位置
which git

# 找更多相關檔案
whereis bash
```

---

## 17. 建議記憶方式

可以把 Linux 幫助系統想成一座圖書館：

| 工具        | 比喻       |
| --------- | -------- |
| `--help`  | 櫃台便條     |
| `help`    | Shell 老師 |
| `man`     | 正式手冊     |
| `info`    | 深入教材     |
| `whatis`  | 一句話摘要    |
| `apropos` | 圖書館搜尋系統  |
| `type`    | 查命令身分證   |
| `which`   | 查執行路徑    |
| `whereis` | 查相關資料夾   |

---

## 結語

Linux 命令很多，不可能全部背完。

真正重要的不是背下每個參數，而是知道忘記時該去哪裡查。

當你熟悉 `help`、`--help`、`man`、`info`、`whatis`、`apropos` 這些工具後，終端機就不再只是輸入命令的地方，而會變成一個可以自我學習的系統。

下次忘記命令，不要慌。

先問 Linux 自己。
