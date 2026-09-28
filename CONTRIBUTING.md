<img src=".github/assets/icon-512w.png" width="96" alt="vue-haptics">

# Contributing to vue-haptics

How to open issues, set up the project, and send pull requests.<br>
<sub>Issue、開発環境、PR の進め方をまとめています。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

> [!IMPORTANT]
> We accept pull requests only for work a maintainer has agreed to in an [issue](https://github.com/osaxyz/vue-haptics/issues). Pull requests without a prior agreement may be closed. Haptics behave differently on each device, so we want to agree on the behavior before reviewing code.

### Workflow

1. Check for an existing issue, and open one if there is none.
2. Wait for a maintainer to agree on the issue and the approach.
3. Create a branch named `<type>/<issue-number>-<summary>`, such as `fix/12-ios-double-tick`, and implement the change.
4. Open a pull request that references the issue.
5. Once review and CI pass, a maintainer merges it with a merge commit.

<details>
<summary>Development</summary>
<br>

This is a Turborepo monorepo managed with pnpm.

| Path | Contents |
| --- | --- |
| `apps/vue-haptics` | The library published to npm |
| `apps/demo` | A Vite app for trying haptics on a phone |
| `packages/tsconfig` | Shared TypeScript settings |

| Command | What it does |
| --- | --- |
| `pnpm install` | Installs dependencies |
| `pnpm test` | Runs the Vitest suite with happy-dom |
| `pnpm lint` | Checks everything with Biome, and the demo's `.vue` files with ESLint |
| `pnpm typecheck` | Type checks every package |
| `pnpm build` | Builds the library and the demo |
| `pnpm dev` | Watches the library and serves the demo |

Haptics cannot be tested in a desktop browser. Run `pnpm dev` and scan the QR code in the terminal to open the demo on a phone on the same network.

</details>

<details>
<summary>Commit messages</summary>
<br>

Write `type(scope): description`. The scope is the top-level directory that changed, or `repo` for changes across the repository. The description is a short Japanese sentence that ends with an action.

```text
OK  fix(src): iOS で2回目の tick が鳴らない不具合を修正
OK  docs(repo): README のクイックスタートを更新
NG  fix: bug
NG  feat(src): ディレクティブ
```

| type | Use for |
| --- | --- |
| `feat` | New features |
| `fix` | Bug fixes |
| `perf` | Performance |
| `refactor` | Changes without behavior changes |
| `docs` | Documentation |
| `test` | Tests |
| `build`, `ci`, `chore` | Build settings, CI, and everything else |

</details>

<details>
<summary>Releases</summary>
<br>

Releases are published by `.github/workflows/publish.yml` with npm Trusted Publishing and provenance. Nobody publishes from a local machine.

1. Update `version` in `apps/vue-haptics/package.json` and `VERSION`, and add release notes to `llm/version/<version>.md`.
2. Merge the change into `main`.
3. Run the workflow.

```sh
gh workflow run publish.yml --ref main
```

The workflow refuses to run from any branch other than `main`, and only the `npm` environment can publish.

</details>

<a id="ja"></a>

## 日本語

> [!IMPORTANT]
> PR は、メンテナーが [Issue](https://github.com/osaxyz/vue-haptics/issues) で合意した作業に限って受け付けます。事前の合意がない PR は閉じることがあります。触覚フィードバックは端末ごとに挙動が違うので、コードをレビューする前に振る舞いを合意しておきたいためです。

### 進め方

1. 既存の Issue を探し、なければ起票します。
2. メンテナーが Issue と進め方に合意するのを待ちます。
3. `fix/12-ios-double-tick` のように `<type>/<Issue 番号>-<要約>` の名前でブランチを作り、実装します。
4. Issue を参照する PR を作ります。
5. レビューと CI が通ったら、メンテナーが merge commit でマージします。

<details>
<summary>開発</summary>
<br>

pnpm で管理する Turborepo のモノレポです。

| パス | 中身 |
| --- | --- |
| `apps/vue-haptics` | npm に公開するライブラリ |
| `apps/demo` | スマホで触覚フィードバックを試す Vite のアプリ |
| `packages/tsconfig` | 共有の TypeScript 設定 |

| コマンド | 内容 |
| --- | --- |
| `pnpm install` | 依存をインストールします |
| `pnpm test` | happy-dom の上で Vitest を実行します |
| `pnpm lint` | 全体を Biome で、デモの `.vue` ファイルを ESLint で検査します |
| `pnpm typecheck` | すべてのパッケージの型を検査します |
| `pnpm build` | ライブラリとデモをビルドします |
| `pnpm dev` | ライブラリを監視しながら、デモを配信します |

触覚フィードバックはデスクトップのブラウザでは確かめられません。`pnpm dev` を実行し、ターミナルに出る QR コードを同じネットワークのスマホで読み取ってデモを開きます。

</details>

<details>
<summary>コミットメッセージ</summary>
<br>

`type(scope): 説明` の形で書きます。scope は変更したトップレベルのディレクトリ名で、リポジトリ全体に関わる変更は `repo` にします。説明は動作で終わる短い日本語の文にします。履歴を検索しやすくし、人とエージェントのどちらが書いても同じ見た目にするためです。

```text
OK  fix(src): iOS で2回目の tick が鳴らない不具合を修正
OK  docs(repo): README のクイックスタートを更新
NG  fix: bug
NG  feat(src): ディレクティブ
```

| type | 使う場面 |
| --- | --- |
| `feat` | 新機能 |
| `fix` | 不具合の修正 |
| `perf` | 性能の改善 |
| `refactor` | 振る舞いを変えない改善 |
| `docs` | ドキュメント |
| `test` | テスト |
| `build`、`ci`、`chore` | ビルド設定、CI、その他 |

</details>

<details>
<summary>リリース</summary>
<br>

リリースは `.github/workflows/publish.yml` が npm の Trusted Publishing と provenance 付きで公開します。手元のマシンからは公開しません。

1. `apps/vue-haptics/package.json` と `VERSION` の `version` を更新し、`llm/version/<version>.md` にリリースノートを書きます。
2. 変更を `main` にマージします。
3. ワークフローを実行します。

```sh
gh workflow run publish.yml --ref main
```

ワークフローは `main` 以外のブランチからは動かず、公開できるのは `npm` environment だけです。

</details>
