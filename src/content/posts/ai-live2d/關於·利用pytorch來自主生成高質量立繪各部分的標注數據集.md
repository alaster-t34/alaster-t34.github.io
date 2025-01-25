---
title: 關於·利用pytorch、Mask R-CNN與DeepLab v3+用來拆分的想法
published: 2025-01-22
description: ''
image: ''
tags: [AI, Live2D]
category: 'live2d'
draft: false 
lang: ''
---

<br>
                      ▇ ▆ ▅ ▃ ▂ ▁ ▂ ▃ ▅ ▆ ▇ 
<br>

用於拆分的ai模型，要分爲兩部分
* 1. 用於標記（注）的ai模型
* 2. 用於拆分的ai模型

# 用於標注的ai、模型

1. 準備數據集與訓練的基礎
   * 收集數據（立繪圖像），需具備多個部件
       我打算從蔚藍檔案，少女前綫，碧藍航綫，鳴潮，少前2·追放裏獲得（但是，但是哈，不夠，這還不夠）
   * 手動標注少量成本，作爲初始訓練數據
       采用遷移學習和數據增强等技術，利用少量標記樣本來起到初步訓練模型的作用。
       預計要300張標記圖。

   * 每個立繪圖像的標簽應是分割圖（mask）
   * 每個部件對應一個唯一的標簽
2. 使用深度學習模型進行圖像分割
   * 采用 **DeepLab v3+** 等预训练模型，分割出不同的图层。  
3. 将分割后的不同部分提取出来并保存
4. 優化


最主要的拆分部分
头发：前发、后发、侧发等。
眼睛：上眼皮、下眼皮、瞳孔等。
嘴巴：上嘴唇、下嘴唇、舌头、牙齿等。
眼睫毛。
眉毛。
衣服：上衣、裤子、裙子等。
面部：面颊、鼻子、下巴等。
耳朵。
四肢：手臂、手、脚、腿等。
配件和饰品：耳环、眼镜、帽子等。
---

需要的一些python庫：pytorch torchvision matplotlib opencv-python pillow numpy

```bash
pip install torch torchvision matplotlib opencv-python pillow numpy
```

## 關於加載DeepLabV3+預訓練模型
```python
import torch
import torchvision #導入torchvision模組
from torchvision import models #導入models模組
import matplotlib.pyplot as plt #導入matplotlib.pyplot模組
from PIL import Image #導入PIL.Image模組
import torchvision.transforms as T #導入torchvision.transforms模組

model = torchvision.models.segmentation.deeplabv3_resnet101(pretrained=True) #加載DeepLabV3+預訓練模型
model = model.eval() #設為評估(eval)模式
```
代碼解析：
* torchvision.models：這部分用來加載深度學習模型（如 DeepLabV3+）。
* matplotlib.pyplot：用來顯示圖像及繪製可視化。
* PIL.Image：用於打開和處理圖像文件。
* torchvision.transforms：用於對圖像進行預處理（如調整大小、標準化等）。