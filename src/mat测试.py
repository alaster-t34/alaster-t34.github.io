import numpy as np
import matplotlib.pyplot as plt

# 定义参数范围
theta = np.linspace(0, 2 * np.pi, 1000)

# 计算极径 R
a = 1  # 可以调整这个值来改变心形的大小
R = a * (1 - np.sin(theta))

# 转换为直角坐标系下的 x 和 y 坐标
x = R * np.cos(theta)
y = R * np.sin(theta)

# 绘制图形
plt.figure(figsize=(6, 6))
plt.plot(x, y, color='red')
plt.axis('equal')  # 使 x 和 y 轴比例相同
plt.title('心形线 (R = a(1 - sinθ))')
plt.xlabel('x')
plt.ylabel('y')
plt.grid(True)
plt.show()