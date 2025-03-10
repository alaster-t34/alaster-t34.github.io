---
title: 關於·利用pytorch、Mask R-CNN與U-Net用來拆分的想法
published: 2025-01-22
description: ''
image: './光啊.jpg'
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
   * 采用 **U-Net** 等预训练模型，分割出不同的图层。  
3. 将分割后的不同部分提取出来并保存
4. 優化


最主要的拆分部分<br>
头发：前发、后发、侧发等。<br>
眼睛：上眼皮、下眼皮、瞳孔等。<br>
嘴巴：上嘴唇、下嘴唇、舌头、牙齿等。<br>
衣服：上衣、裤子、裙子等。<br>
面部：面颊、鼻子、下巴等。<br>
耳朵。<br>
四肢：手臂、手、脚、腿等。<br>

配件和饰品：耳环、眼镜、帽子等。<br>
---

需要的一些python庫：pytorch torchvision matplotlib opencv-python pillow numpy

```bash
pip install torch torchvision matplotlib opencv-python pillow numpy
```

## 構建標注系統的步驟
1. 訓練自動標注模型
   要基於已有的標註數據集訓練圖像分割模型，這樣模型可以學會如何對圖像進行像素級的標註。
   ```python
   # 假設你已經訓練了U-Net模型並將其命名為 `unet_model`
   model = UNet(in_channels=3, out_channels=3)  # 設定為分割三個類別（例如，背景、頭髮、衣服）
   
   # 訓練模型的步驟與之前相同，並保存模型
   ```

2. 建立自動標記系統
   使用訓練好的模型來對新的圖像進行自動標註。
   ```python
   import torch
   from PIL import Image
   import numpy as np
   import torchvision.transforms as transforms

  # 加載模型
   model = UNet(in_channels=3, out_channels=3)
   model.load_state_dict(torch.load('unet_model.pth'))
   model.eval()

  # 預處理圖片
   transform = transforms.Compose([
       transforms.Resize((256, 256)),
       transforms.ToTensor(),
])

   def auto_label(image_path):
       image = Image.open(image_path).convert('RGB')
       image_tensor = transform(image).unsqueeze(0)  # 增加 batch 維度
    
       with torch.no_grad():
           output = model(image_tensor)
       # 轉換輸出為標註圖像
       output = torch.argmax(output, dim=1).squeeze().cpu().numpy()
    
       return output

    # 處理文件夾中的所有圖像
   input_folder = 'path_to_images'
   output_folder = 'path_to_output_labels'

for image_name in os.listdir(input_folder):
    image_path = os.path.join(input_folder, image_name)
    label = auto_label(image_path)
    
    # 儲存自動生成的標註圖像
    label_image = Image.fromarray(label.astype(np.uint8))  # 保存為圖片
    label_image.save(os.path.join(output_folder, f'{image_name}_label.png'))
```