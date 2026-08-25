# 研究结论：官网 Hero 代码示例选型（issue #2）

> 问题：哪一小段 Heirloom TS DSL（对象类型 + 链接 + 动作，10–20 行）最能向首次到访的开发者展示 DX？
> 来源：`heirloom-pro/docs/spec/`（main @ 4bdd304）与其冻结示例本体 `prototype/ts-dsl-shape/prototype/ts-dsl-shape/ontology.ts`（分支 `prototype/ts-dsl-shape` @ 456ccd4，被 spec 90 附录 §5 索引为规格示例本体的权威冻结反应物，10 章 §7 与 80 章的示例均冻结自该文件）。
> 仓库尚无研究笔记目录约定（现有 `docs/agents/` 只放 agent 流程文档），本文件放 `docs/research/`。

## 评估标准

面向首次到访开发者的营销页片段应满足：

1. **三构造同框**：对象类型、一等链接、动作各至少一处（issue 硬性要求）。
2. **叙事闭环**：片段内声明的链接，最好就是动作里使用的那条——读者一遍读完即懂。
3. **展示差异化**：体现 Heirloom 区别于普通 ORM/CRUD 的点（一等链接、动作=单事务领域动词、ref 参数注入、事务语义）。
4. **行数 10–20**；逐字引用真实 spec 语法，不杜撰。

## 候选片段（逐字引用）

### 候选 A：Department + transferEmployee（23 行）

出处：`prototype/ts-dsl-shape/ontology.ts`（对象类型块与动作块各一段，同文件相邻区域原样拼合，未改一字）。

```ts
export const Department = objectType({
  apiName: 'department',
  displayName: '部门',
  properties: {
    name: p.string().required().unique().length(1, 80).displayName('部门名'),
    budget: p.decimal().range(0).description('年度预算（元）'),
  },
  links: {
    // 1:N。单侧声明，反向名显式给出；员工侧获得 department 反向遍历
    employees: link.oneToMany(() => Employee, { reverse: 'department', displayName: '成员' }),
  },
});

export const transferEmployee = action({
  apiName: 'transfer-employee',
  displayName: '调动部门',
  params: {
    employee: p.ref(() => Employee).required(),
    toDepartment: p.ref(() => Department).required(),
  },
  execute: (ctx, { employee, toDepartment }) => {
    // 1:N 重挂：link 即移动，旧部门链接自动摘除
    ctx.link(Department, toDepartment, 'employees', employee);
    return { employeeId: employee.id, departmentId: toDepartment.id };
  },
});
```

### 候选 B：Membership + assignToProject（28 行）

出处：同文件，「链接载荷升级」对象类型块 + 对应动作块，逐字。

```ts
// 链接载荷升级模式（ADR-0001 决策 6）：Membership 的 role/joinedAt 是
  //「员工—项目」关系的载荷，建模为中间对象类型 + 两条 1:N
export const Membership = objectType({
  apiName: 'membership',
  displayName: '项目成员关系',
  properties: {
    role: p.enum(['lead', 'contributor', 'reviewer']).required(),
    joinedAt: p.date().required(),
  },
  links: {
    employee: link.manyToOne(() => Employee, { reverse: 'memberships', required: true }),
    project: link.manyToOne(() => Project, { reverse: 'memberships', required: true }),
  },
});

export const assignToProject = action({
  apiName: 'assign-to-project',
  displayName: '分配项目',
  params: {
    employee: p.ref(() => Employee).required(),
    project: p.ref(() => Project).required(),
    role: p.enum(['lead', 'contributor', 'reviewer']).default('contributor'),
    joinedAt: p.date().default((ctx) => ctx.today),
  },
  execute: (ctx, { employee, project, role, joinedAt }) => {
    const membership = ctx.create(Membership, { role, joinedAt });
    // 同事务新建对象可直接引用（ADR-0003 决策 5）；两条 required 链接在提交时校验
    ctx.link(Membership, membership, 'employee', employee);
    ctx.link(Membership, membership, 'project', project);
    return { membershipId: membership.id };
  },
});
```

### 候选 C：Skill + grantSkill（19 行）

出处：同文件，Skill 对象类型块 + grantSkill 动作块，逐字。另 spec `docs/spec/20-actions.md` §6 内嵌了该动作体的核心两行（查-建两步）。

```ts
export const Skill = objectType({
  apiName: 'skill',
  displayName: '技能',
  properties: {
    name: p.string().required().unique(),
  },
  links: {},
});

export const grantSkill = action({
  apiName: 'grant-skill',
  displayName: '授予技能',
  params: {
    employee: p.ref(() => Employee).required(),
    skillName: p.string().required(),
  },
  execute: (ctx, { employee, skillName }) => {
    // 无 upsert（ADR-0003 决策 4）：显式「查-建」两步，RYW 保证本事务可查到自己刚建的
    const skill = ctx.all(Skill).find((s) => s.name === skillName) ?? ctx.create(Skill, { name: skillName });
    ctx.link(Employee, employee, 'skills', skill);
    return { skillId: skill.id };
  },
});
```

## 推荐：候选 A（Department + transferEmployee）

理由：

- **叙事闭环最紧**：`links.employees` 在类型里声明，动作体里 `ctx.link(Department, ..., 'employees', employee)` 用的正是这条——读者自上而下一遍走完「声明 → 使用」，这正是 DSL「代码即配置」卖点（spec 10 章 §1）的最佳证明。
- **一行展示杀手锏语义**：`execute` 主体只有一行 `ctx.link`，注释点明「link 即移动，旧侧自动摘除」（spec 20 章 §5 的统一基数语义）。首次到访者立刻看到「这不是普通 ORM 外键赋值」。
- **覆盖面刚好**：链式属性修饰符（`required().unique().length()`，10 章 §6 外形决策 1）、一等链接 + 反向命名（§6 决策 2/5）、`p.ref` 对象引用参数注入完整对象（20 章 §3）、单事务动作（20 章 §1）——四个差异化点全部出镜，23 行略超 20 行目标但可再删 `budget` 行与两行注释压到 19 行（页面落地时裁剪，语义不受影响）。
- **概念门槛最低**：部门/员工/调动是零解释的普适领域。

未选另两者的原因：

- **候选 B** 展示了最有本体味的「链接载荷升级」模式（10 章 §4），差异化最强，但 28 行超预算，且要求读者先接受「关系要建模成中间对象」这一反直觉前提——适合作为页面第二屏或文档页示例，不适合 Hero。
- **候选 C** 行数最合（19 行）且 RYW 查-建两步是好故事，但动作里用的 `skills` M:N 链接声明在 `Employee` 上而不在片段内的 `Skill` 上——闭环断裂，读者需脑补片段外的声明；且 `Skill.links: {}` 空块在视觉上浪费一行。

## 落地注意（移交 #1 决策面）

- 冻结本体的 `displayName` 与行内注释为中文，官网为英文站——**逐字引用要求仅约束本研究结论**；页面落地需将 displayName/注释译为英文（如 `displayName: 'Department'`），或按 spec 10 章 §1（`displayName` 为人类可读名、`description` 可选）直接省略 `displayName`/`description` 字段以贴合英文受众并压行数。裁剪/翻译后的页面版本应在代码评审时对照本文件的逐字引用核对语法真实性。
- 片段引用了片段外的 `Employee`（thunk `() => Employee` 与 `p.ref(() => Employee)`），符合 spec 10 章 §6 决策 3（链接目标一律 thunk，前向引用为常态），页面无需补全。
- 所有引用的语法锚点：10 章 §6 DSL 外形八项、20 章 §2 动作定义结构；冻结反应物索引见 90 附录 §5。
