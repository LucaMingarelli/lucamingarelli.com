import numpy as np
import pylab as plt

plt.figure(figsize=(5, 3))

y = 0.25
for n, x in enumerate(range(3)):
    y = (n+2) * 0.25
    plt.gca().annotate("", xy=(x+1.2, y), xytext=(x+0.2, y), arrowprops=dict(arrowstyle="|-|", color='green'))
    plt.gca().annotate("", xy=(x+2.2, y), xytext=(x+1.2, y), arrowprops=dict(arrowstyle="|-|", color='red'))
    plt.gca().annotate("Work", xy=(x + 1.2, y), xytext=(x + 0.5, y+0.03))
    plt.gca().annotate("Retire", xy=(x + 2.2, y), xytext=(x + 1.5, y + 0.03))

plt.gca().annotate("", xy=(0.2, 0.25), xytext=(0, 0.25), arrowprops=dict(arrowstyle="-",linestyle="dotted", alpha=0.2, color='green'))
plt.gca().annotate("", xy=(1.2, 0.25), xytext=(0.2, 0.25), arrowprops=dict(arrowstyle="|-|", alpha=0.2, color='red'))

plt.gca().annotate("", xy=(4.2, 1.25), xytext=(3.2, 1.25), arrowprops=dict(arrowstyle="|-|", alpha=0.2, color='green'))
plt.gca().annotate("", xy=(4.4, 1.25), xytext=(4.2, 1.25), arrowprops=dict(arrowstyle="-",linestyle="dotted", alpha=0.2, color='red'))

plt.xlim(0, 4.5)
plt.ylim(0, 1.5)
plt.xticks([])
plt.yticks([0.25, 0.5, 0.75, 1, 1.25], [r'$\vdots$', r'$n-1$', r'$n$', r'$n+1$', r'$\vdots$'])

# Draw axis
plt.gca().spines[['right', 'top', 'left', 'bottom']].set_visible(False)
plt.gca().annotate("", xy=(4.5, 0), xytext=(-.015, 0), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
plt.gca().annotate("", xy=(0, 1.5), xytext=(0, -.015), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))

plt.xlabel("Time")
plt.ylabel("Generations")

plt.tight_layout()

plt.savefig("Teaching/MacroModelling/ogm.svg", transparent=True)
plt.show()

