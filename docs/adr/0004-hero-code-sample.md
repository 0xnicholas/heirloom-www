# Hero 代码示例选型

Hero/代码区展示 Department 对象类型（含 1:N `employees` 链接）+ `transferEmployee` 动作（`execute` 主体一行 `ctx.link`），逐字引自 `heirloom-pro` 冻结示例本体，落地时 displayName/注释英译、删 budget 行与冗余注释（23 → 19 行量级）。

理由：叙事闭环最紧（类型里声明的链接就是动作体里用的那条，「声明 → 使用」一遍走完）；一行展示链接重挂的杀手锏语义（link 即移动、旧侧自动摘除）；链式属性修饰符、一等链接 + 反向命名、`p.ref` 注入、单事务动作四个差异化点同框。

## Considered Options

- **Membership + assignToProject**（链接载荷升级为中间对象）：最有本体味、差异化最强，但超行数且要求读者接受「关系建模为中间对象」的反直觉前提——适合文档页，不适合 Hero。
- **Skill + grantSkill**：行数最合、查-建两步是好故事，但动作用的 `skills` 链接声明在片段外的 Employee 上，闭环断裂。

逐字出处、完整对比与落地注意见 [`docs/research/code-sample.md`](../research/code-sample.md)（[#2](https://github.com/0xnicholas/heirloom-www/issues/2)）。
