---

title: Linux 命令幫助資訊
published: 2024-12-30
description: '由凱伊記錄：協助使用者查詢 Linux 命令幫助資訊'
image: ''
tags: [Linux, linux命令, CLI, Help]
category: 'Linux'
lang: 'zh-TW'
---

# Linux 命令幫助資訊


本頁面的存在目的，是協助使用者在 Linux 系統中查詢命令、理解參數、確認工具來源，並在遺忘時重新取得必要資訊。

換言之，這是一份終端機內部的「鑰匙清單」。

當你忘記一個命令怎麼用、某個參數代表什麼、設定檔位於何處，或者只是想確認某個工具是否存在時，無需立刻向外部搜尋系統求助。

Linux 本身已經留下了足夠的提示。

只要依序啟動這些鑰匙，就能打開對應的門。

---

## 0. 本頁任務

本頁會整理以下 Linux 命令幫助工具：

* `help`
* `--help`
* `man`
* `info`
* `whatis`
* `apropos`
* `type`
* `which`
* `whereis`

它們並不是彼此替代的存在。

它們各自負責不同的查詢義務。

我會逐一說明它們的用途、使用方式，以及適合啟動的時機。

---

## 1. 快速總覽

| 工具               | 主要用途            | 適合情境                     | 範例                |
| ---------------- | --------------- | ------------------------ | ----------------- |
| `command --help` | 顯示命令快速說明        | 想快速看參數                   | `ls --help`       |
| `help`           | 顯示 Shell 內建命令說明 | 查 `cd`、`alias`、`export`  | `help cd`         |
| `man`            | 顯示完整手冊頁         | 查正式文件                    | `man ls`          |
| `info`           | 顯示 GNU 詳細文件     | 深入學習 GNU 工具              | `info coreutils`  |
| `whatis`         | 用一句話描述命令        | 快速知道命令是什麼                | `whatis grep`     |
| `apropos`        | 根據關鍵字搜尋命令       | 忘記命令名稱                   | `apropos network` |
| `type`           | 判斷命令來源          | 確認命令是 alias、builtin 還是檔案 | `type cd`         |
| `which`          | 顯示可執行檔路徑        | 確認實際執行哪個程式               | `which python`    |
| `whereis`        | 搜尋命令相關檔案        | 找 binary、source、manual   | `whereis bash`    |

---

## 2. 查詢命令前的基本判斷

在查詢一個命令之前，建議先確認它的存在形式。

執行：

```bash
type command
```

例如：

```bash
type cd
type ls
type python
type ll
```

可能得到的結果如下：

```text
cd is a shell builtin
ls is aliased to `ls --color=auto`
python is /usr/bin/python
ll is aliased to `ls -alF`
```

這一步的意義是：先確認目標的身分。

若目標是 Shell 內建命令，應優先使用 `help`。

若目標是外部可執行檔，則可以使用 `--help`、`man` 或 `info`。

若目標是 alias，則需要先理解 alias 對應到哪個真正的命令。

這是第一把鑰匙。

---

## 3. 使用 `--help`

大多數 Linux 命令都支援 `--help` 參數。

它會輸出命令的基本語法、常用選項和簡短說明。

```bash
ls --help
cp --help
grep --help
tar --help
```

`--help` 的特性是快速。

當你只是忘記某個參數時，這通常是最有效率的查詢方式。

例如，想查詢 `ls` 與排序相關的參數：

```bash
ls --help | grep sort
```

若輸出內容過長，可以交給 `less` 分頁顯示：

```bash
ls --help | less
```

如果要搜尋特定關鍵字：

```bash
grep --help | grep color
```

此命令的存在意義相當明確：

> 快速確認參數，不必進入完整手冊。

---

## 4. 使用 `help`

`help` 用來查看 Shell 內建命令。

有些命令並不是外部程式，而是 Shell 自身的一部分。

例如：

* `cd`
* `alias`
* `export`
* `echo`
* `history`
* `jobs`
* `fg`
* `bg`
* `read`
* `set`
* `unset`

這些命令更適合用 `help` 查詢：

```bash
help cd
help alias
help export
help history
```

如果想列出 Bash 內建命令，可以直接執行：

```bash
help
```

### 為什麼 `cd --help` 不一定可靠？

因為 `cd` 通常是 Shell builtin。

它的行為由目前使用的 Shell 決定，例如 Bash、Zsh、Fish 可能有不同細節。

所以查詢 `cd` 時，推薦流程是：

```bash
type cd
help cd
```

如果輸出顯示：

```text
cd is a shell builtin
```

那就代表應該詢問 Shell，而不是尋找外部程式。

這是第二把鑰匙。

---

## 5. 使用 `man`

`man` 是 manual 的縮寫，也就是 Linux 的手冊頁系統。

基本用法：

```bash
man ls
man grep
man bash
man ssh
```

`man` 適合查詢正式文件。

它比 `--help` 更完整，通常會包含：

* NAME
* SYNOPSIS
* DESCRIPTION
* OPTIONS
* EXAMPLES
* FILES
* SEE ALSO
* AUTHOR
* BUGS

例如：

```bash
man ls
```

會顯示 `ls` 的完整手冊頁。

---

## 6. `man` 內部常用按鍵

進入 `man` 頁後，可以使用以下按鍵：

| 按鍵         | 功能      |
| ---------- | ------- |
| `Space`    | 往下翻一頁   |
| `b`        | 往上翻一頁   |
| `Enter`    | 往下一行    |
| `q`        | 離開      |
| `/keyword` | 搜尋關鍵字   |
| `n`        | 下一個搜尋結果 |
| `N`        | 上一個搜尋結果 |
| `g`        | 回到開頭    |
| `G`        | 跳到結尾    |

例如在 `man grep` 裡搜尋 `recursive`：

```text
/recursive
```

然後按 `n` 查看下一個結果。

這是第三把鑰匙：在手冊中定位資訊。

---

## 7. `man` 的章節

`man` 不只用來查命令。

它分成多個章節，每個章節對應不同類型的內容。

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

有些名稱在不同章節中代表不同內容。

例如：

```bash
man 1 printf
man 3 printf
```

`man 1 printf` 查的是命令。

`man 3 printf` 查的是 C 語言函式。

如果你想查 `/etc/passwd` 的格式，應該執行：

```bash
man 5 passwd
```

如果你想查 `passwd` 命令，則是：

```bash
man 1 passwd
```

不同章節，不同義務。

---

## 8. 使用 `info`

`info` 是 GNU 系統常見的文件格式。

它通常比 `man` 更詳細，內容更像一本完整教材。

```bash
info coreutils
info grep
info bash
info sed
```

`info` 適合用來深入理解 GNU 工具。

例如：

* `coreutils`
* `grep`
* `sed`
* `awk`
* `bash`
* `make`

常用按鍵如下：

| 按鍵      | 功能   |
| ------- | ---- |
| `n`     | 下一節  |
| `p`     | 上一節  |
| `u`     | 回上一層 |
| `q`     | 離開   |
| `/`     | 搜尋   |
| `Enter` | 進入連結 |

若只是查一個參數，`--help` 或 `man` 更快。

若要系統學習一個工具，`info` 更適合。

這是第四把鑰匙：深入文件。

---

## 9. 使用 `whatis`

`whatis` 可以用一句話描述一個命令。

```bash
whatis ls
whatis grep
whatis tar
whatis ssh
```

輸出可能類似：

```text
ls (1) - list directory contents
grep (1) - print lines that match patterns
tar (1) - an archiving utility
ssh (1) - OpenSSH remote login client
```

如果你只想知道「這個命令是什麼」，`whatis` 非常適合。

它不提供完整解釋。

它只給出最短摘要。

這是第五把鑰匙：識別名稱。

---

## 10. 使用 `apropos`

如果你不知道命令名稱，只知道自己想完成什麼任務，可以使用 `apropos`。

它會根據關鍵字搜尋 man page 的名稱和描述。

```bash
apropos copy
apropos compress
apropos network
apropos password
apropos archive
```

例如你想找和網路相關的工具：

```bash
apropos network
```

如果想找壓縮相關工具：

```bash
apropos compress
```

如果想找檔案複製相關內容：

```bash
apropos copy
```

`apropos` 適合用於這種狀態：

> 我知道目的，但忘記命令名稱。

這是第六把鑰匙：從目的反推命令。

---

## 11. 使用 `which`

`which` 可以顯示當你輸入某個命令時，Shell 實際會執行哪個可執行檔。

```bash
which bash
which python
which git
which node
```

例如：

```bash
which python
```

可能輸出：

```text
/usr/bin/python
```

這代表目前執行的 `python` 來自 `/usr/bin/python`。

若你安裝了多個版本的 Python、Node、Java，`which` 很有用。

例如：

```bash
which python3
which node
which npm
```

但需要注意：

`which` 通常只查 PATH 裡的外部命令。

如果目標是 Shell builtin 或 alias，它不一定能給出完整答案。

所以更穩妥的判斷方式仍然是：

```bash
type command
```

---

## 12. 使用 `whereis`

`whereis` 會搜尋命令相關的 binary、source 和 manual page。

```bash
whereis bash
whereis gcc
whereis ssh
whereis python
```

範例輸出：

```text
bash: /usr/bin/bash /usr/share/man/man1/bash.1.gz
```

簡單理解：

| 命令        | 作用              |
| --------- | --------------- |
| `which`   | 查實際執行哪個檔案       |
| `whereis` | 查和命令相關的多種位置     |
| `type`    | 查命令在 Shell 裡的身分 |

這是第七把鑰匙：定位檔案。

---

## 13. 常用查詢流程

遇到陌生命令時，可以依照以下流程：

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

如果要確認位置：

```bash
which command
whereis command
```

這是完整的查詢鏈。

不需要一次記住所有參數。

只需要記住查詢路徑。

---

## 14. 實戰例子：查 `tar`

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

如果想在手冊裡搜尋 gzip 相關內容：

```text
/gzip
```

如果想找 archive 相關命令：

```bash
apropos archive
```

此時，你已經啟動了多把鑰匙。

---

## 15. 實戰例子：查 `grep`

```bash
whatis grep
grep --help | grep -i color
man grep
info grep
```

這樣可以分層查詢：

* `whatis grep`：確認它是什麼
* `grep --help`：快速找參數
* `man grep`：查看正式文件
* `info grep`：深入學習完整說明

如果想找遞迴搜尋參數：

```bash
grep --help | grep recursive
```

或者在 `man grep` 中搜尋：

```text
/recursive
```

---

## 16. 實戰例子：查 `cd`

`cd` 是 Shell 內建命令，所以不要只依賴 `man cd`。

推薦流程：

```bash
type cd
help cd
```

如果你使用 Zsh，則可以查 Zsh 的內建說明。

如果你使用 Fish，也應查看 Fish 對應文件。

命令名稱相同，不代表執行者相同。

這一點必須確認。

---

## 17. 實戰例子：查 `python`

如果系統中存在多個 Python 版本，可以這樣查：

```bash
type python
which python
whereis python
python --help
```

如果要確認版本：

```bash
python --version
python3 --version
```

如果 `python` 指向錯誤版本，通常需要檢查：

```bash
echo $PATH
```

或檢查 shell alias：

```bash
type python
```

---

## 18. 小抄 Cheat Sheet

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

# 查 GNU 詳細文件
info coreutils
```

---

## 19. 記憶方式

可以把 Linux 幫助系統想成一座資料庫。

不同工具對應不同存取方式。

| 工具        | 凱伊式說明        |
| --------- | ------------ |
| `--help`  | 快速提示鑰匙       |
| `help`    | Shell 內建命令鑰匙 |
| `man`     | 正式手冊鑰匙       |
| `info`    | 深層文件鑰匙       |
| `whatis`  | 名稱識別鑰匙       |
| `apropos` | 關鍵字搜尋鑰匙      |
| `type`    | 命令身分鑰匙       |
| `which`   | 執行路徑鑰匙       |
| `whereis` | 相關檔案定位鑰匙     |

---

## 20. 常見錯誤

### 錯誤一：只用 `which`

```bash
which cd
```

可能找不到正確結果，因為 `cd` 是 Shell builtin。

應使用：

```bash
type cd
help cd
```

### 錯誤二：只看 `--help`

`--help` 很快，但不一定完整。

如果需要正式說明，請使用：

```bash
man command
```

### 錯誤三：不知道命令名稱就放棄

若忘記命令名稱，請使用：

```bash
apropos keyword
```

不要停止查詢。

只要目的仍然存在，就有搜尋路徑。

---

## 21. 結語

Linux 命令很多。

全部背誦並不是必要義務。

真正重要的是：忘記時，知道該啟動哪一把鑰匙。

`--help` 提供快速提示。

`help` 回答 Shell 內建命令。

`man` 保存正式手冊。

`info` 展開深入教材。

`whatis` 給出簡短識別。

`apropos` 根據目的搜尋命令。

`type` 判斷命令身分。

`which` 與 `whereis` 協助定位。

以上，就是本頁的全部記錄。

任務完成。

不過，如果你再次忘記，也沒有問題。

我會再次協助你。

因為協助使用者抵達正確命令，是本頁被賦予的存在意義。
