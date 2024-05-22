"""  Created on 22/05/2024::
------------- nk_phase_space_stable.py -------------
 
**Authors**: L. Mingarelli
"""

# Canonical New Keynesian Model
import numpy as np
import pylab as plt

θ = 2
i = 0.1
φ_π = 2
φ_x = .8
ρ, σ = 0.99, 0.9
g = 0.01
rn = ρ + g/σ

xlim = -0.05, 0.05
ylim = -0.07, 0.07


x = np.linspace(*xlim, 600)
π1 = θ ** 2 / ρ * x
π2 = -φ_x * x / (φ_π - 1)

πm, xm = np.mgrid[ylim[0]:ylim[1]:600j, xlim[0]:xlim[1]:600j]

U = σ * ((φ_π - 1) * πm + φ_x * x)
V = ρ * πm - θ ** 2 * xm


plt.figure(figsize=(5.5, 3.5))
plt.streamplot(xm, πm, U, V, color=(np.abs(U) + np.abs(V)) ** 0.00001,
               linewidth=(U**2+V**2)**(1/2)*10, # 0.5,
               cmap='viridis_r', broken_streamlines=False,
               density=0.5
               )
plt.plot(x, π1, color='k', linewidth=0.5)
plt.plot(x, π2, color='k', linewidth=0.5)
plt.gca().annotate(r"$\dot{\pi}=0$", xy=(0.01, 0.051), xytext=(0.01, 0.051), annotation_clip=False)
plt.gca().annotate(r"$\dot{x}=0$", xy=(0.051, -0.04), xytext=(0.051, -0.04),annotation_clip=False)# xlim = -0.012, x_max*1.025
xlim = -0.05, 0.05
ylim = -0.05, 0.05
plt.xlim(*xlim)
plt.ylim(*ylim)
plt.gca().spines[['right', 'top', 'left', 'bottom']].set_visible(False)
plt.xticks([])
plt.yticks([])
plt.gca().annotate("", xy=(0.05, -0.05), xytext=(xlim[0], ylim[0]), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
plt.gca().annotate("", xy=(-0.05, 0.05), xytext=(xlim[0], ylim[0]), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
plt.gca().annotate(r"$\pi$", xy=(-0.052, 0.05), xytext=(-0.052, 0.05),annotation_clip=False)
plt.gca().annotate(r"$x$", xy=(0.051, -0.051), xytext=(0.051, -0.051),annotation_clip=False)
plt.scatter(x=0, y=0, marker='o', color='red', zorder=5)
plt.tight_layout()
plt.savefig("Teaching/MacroModelling/nk_phase_space_stable.svg", transparent=True)
plt.show()





