<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/logo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/assets/logo.png">
  <img src="docs/assets/logo.png" width="96" alt="vue-haptics">
</picture>

# vue-haptics

Haptic feedback for Vue 3 that also works on iOS Safari, where the Vibration API is not available.<br>
<sub>Vibration API が使えない iOS Safari でも動く、Vue 3 向けの触覚フィードバックです。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

<p align="center">
  <a href="https://github.com/osaxyz/vue-haptics"><img src="https://img.shields.io/github/stars/osaxyz/vue-haptics?style=social" alt="Star vue-haptics on GitHub"></a><br>
  <sub>If vue-haptics helps you, a star keeps us going.</sub>
</p>

> [!IMPORTANT]
> vue-haptics requires Vue 3.3 or later. Haptics play on Android browsers with the Vibration API and on iOS Safari 18 or later; elsewhere, calls do nothing. v3.0.0 is a rewrite, and `useHaptic` and `triggerHaptic` from v2 have been removed.

### Quick start

1. Install the package.

```sh
npm install vue-haptics
```

2. Register the plugin.

```ts
import { createApp } from "vue"
import { createHaptics } from "vue-haptics"
import App from "./App.vue"

createApp(App).use(createHaptics()).mount("#app")
```

3. Add `v-haptic` to a button.

```vue
<template>
  <button v-haptic>Tap</button>
  <button v-haptic="[10, 60, 10]">Double tap</button>
</template>
```

4. Open the page on a phone and tap the button. You should feel a short tick on Android and on iPhone.

> [!TIP]
> Pass `disabled: () => !settings.haptics` to `createHaptics()` to let users turn haptics off across the whole app.

To play haptics from script, use the composable, or `haptic()` outside components.

```ts
import { haptic, useHaptics } from "vue-haptics"

const { trigger } = useHaptics({ pattern: 20 })
trigger()

haptic([10, 60, 10])
```

### Technology

<details>
<summary>Haptics on iOS Safari without the Vibration API</summary>
<br>

iOS Safari does not implement `navigator.vibrate()`. Since Safari 18, toggling an `<input type="checkbox" switch>` plays a system haptic, so vue-haptics toggles a hidden switch through its label. Where the Vibration API exists, it is used instead. The path is chosen by feature detection, not by the user agent, so iPadOS, which reports a Mac user agent, is handled too.

| Environment | How it plays |
| --- | --- |
| Android Chrome and other browsers with the Vibration API | `navigator.vibrate(pattern)` |
| iOS Safari 18 or later | Toggles a hidden `<input switch>` once per "on" segment of the pattern |
| Others, and SSR | Does nothing |

The idea of using `<input switch>` comes from [use-haptic](https://github.com/posaune0423/use-haptic) by Asuma Yamada. vue-haptics started as a Vue port of it, and v3 is a rewrite for Vue.

</details>

<details>
<summary>One hidden element for the whole page</summary>
<br>

The hidden switch is created on the first call and shared by every component, directive and call site. Nothing is added to the DOM until haptics are requested. Clicks on the switch stop at its container, so they never reach your own click handlers such as click-outside detection.

</details>

<details>
<summary>SSR safe</summary>
<br>

Every entry point checks for `window` and `document` before touching them. `isSupported` from `useHaptics()` starts as `false` and is updated after mount, so the server render and hydration agree. The directive renders no attributes on the server.

</details>

<details>
<summary>Published with npm provenance</summary>
<br>

Releases are built and published from GitHub Actions with npm Trusted Publishing, so no npm token exists anywhere. Each version carries a provenance statement that links it to the commit and workflow run it was built from. The build job and the job that holds the publishing credential are separate, so a compromised dependency cannot publish a fake package.

</details>

### Specification

<details>
<summary>Patterns</summary>
<br>

A pattern is a length in milliseconds, or an array of alternating on and off lengths, in the same shape as `navigator.vibrate()`. The default is `DEFAULT_PATTERN`, which is 10.

| Pattern | Android | iOS |
| --- | --- | --- |
| `10` | Vibrates for 10ms | One tick |
| `[10, 60, 10]` | 10ms on, 60ms off, 10ms on | Two ticks 70ms apart |
| `0` or `[]` | Stops the current pattern | Cancels the remaining ticks |

A new call replaces a pattern that is still playing. iOS cannot control how long a tick lasts, and plays haptics only in response to a user gesture. Ticks after the first are played on a timer, and iOS may drop them.

</details>

<details>
<summary>v-haptic</summary>
<br>

| Usage | Behavior |
| --- | --- |
| `v-haptic` | Plays the default pattern on click |
| `v-haptic="pattern"` | Plays the given pattern |
| `v-haptic="false"` | Does nothing. `true` plays the default pattern |
| `v-haptic:pointerdown` | Listens to the given event instead of `click` |

The plugin registers the directive with its options. Without the plugin, import `vHaptic` and use it in `<script setup>`. `createHapticDirective(options)` builds a directive with your own defaults.

</details>

<details>
<summary>Functions and composable</summary>
<br>

| Export | Description |
| --- | --- |
| `haptic(pattern?)` | Plays a pattern. Can be called anywhere, including outside components |
| `isHapticsSupported()` | Whether the device can play haptics. `false` during SSR |
| `useHaptics(options?)` | Returns `trigger(pattern?)` and a readonly `isSupported` ref. `trigger` ignores a DOM event, so it can be bound as a handler |
| `createHaptics(options?)` | Plugin that registers the directive and sets app-wide defaults |
| `createHapticDirective(options?)` | Builds a directive with its own defaults |

</details>

<details>
<summary>Options</summary>
<br>

| Option | Type | Used by | Description |
| --- | --- | --- | --- |
| `pattern` | `MaybeRefOrGetter<HapticPattern>` | all | Pattern used when none is given |
| `disabled` | `MaybeRefOrGetter<boolean>` | all | Suppresses haptics while true |
| `directive` | `string \| false` | `createHaptics` | Name of the directive, `"haptic"` by default. `false` skips registration |

Options passed to `useHaptics()` take precedence over the plugin options.

</details>

<details>
<summary>Migrating from v2</summary>
<br>

| v2 | v3 |
| --- | --- |
| `useHaptic(duration)` | `useHaptics({ pattern: duration })` |
| `triggerHaptic()` | `trigger()` |
| `<button @click="triggerHaptic">` | `<button v-haptic>` |

The default length changed from 5ms to 10ms, and Vue 3.3 or later is required.

</details>

<a id="ja"></a>

## 日本語

<p align="center">
  <a href="https://github.com/osaxyz/vue-haptics"><img src="https://img.shields.io/github/stars/osaxyz/vue-haptics?style=social" alt="Star vue-haptics on GitHub"></a><br>
  <sub>vue-haptics が役に立ったら、スターを付けてもらえると励みになります。</sub>
</p>

> [!IMPORTANT]
> vue-haptics には Vue 3.3 以上が必要です。触覚フィードバックは、Vibration API のある Android のブラウザと、iOS Safari 18 以上で鳴ります。それ以外の環境では呼び出しても何も起きません。v3.0.0 は書き直した版で、v2 の `useHaptic` と `triggerHaptic` は廃止しました。

### クイックスタート

1. パッケージをインストールします。

```sh
npm install vue-haptics
```

2. プラグインを登録します。

```ts
import { createApp } from "vue"
import { createHaptics } from "vue-haptics"
import App from "./App.vue"

createApp(App).use(createHaptics()).mount("#app")
```

3. ボタンに `v-haptic` を付けます。

```vue
<template>
  <button v-haptic>Tap</button>
  <button v-haptic="[10, 60, 10]">Double tap</button>
</template>
```

4. スマホでページを開いてボタンを押します。Android でも iPhone でも、短い振動が返ってくれば動いています。

> [!TIP]
> `createHaptics()` に `disabled: () => !settings.haptics` を渡すと、アプリ全体の触覚フィードバックを利用者の設定でオフにできます。

スクリプトから鳴らすときは composable を使います。コンポーネントの外では `haptic()` を使います。

```ts
import { haptic, useHaptics } from "vue-haptics"

const { trigger } = useHaptics({ pattern: 20 })
trigger()

haptic([10, 60, 10])
```

### テクノロジー

<details>
<summary>Vibration API のない iOS Safari でも鳴らせます</summary>
<br>

iOS Safari は `navigator.vibrate()` を実装していません。Safari 18 からは `<input type="checkbox" switch>` を切り替えるとシステムの触覚フィードバックが鳴るので、vue-haptics は隠したスイッチを label 経由で切り替えます。Vibration API がある環境ではそちらを使います。経路は UA ではなく機能の有無で選ぶので、Mac の UA を返す iPadOS も取りこぼしません。

| 環境 | 鳴らし方 |
| --- | --- |
| Android Chrome など Vibration API のあるブラウザ | `navigator.vibrate(pattern)` |
| iOS Safari 18 以上 | パターンの「オン」の区間ごとに、隠した `<input switch>` を1回切り替えます |
| それ以外と SSR | 何もしません |

`<input switch>` を使う発想は、Asuma Yamada さんの [use-haptic](https://github.com/posaune0423/use-haptic) によるものです。vue-haptics はその Vue への移植として始まり、v3 で Vue 向けに書き直しました。

</details>

<details>
<summary>隠し要素はページ全体で1つです</summary>
<br>

隠しスイッチは最初の呼び出しで作られ、すべてのコンポーネント、ディレクティブ、呼び出し元で共有されます。触覚フィードバックを求められるまで DOM には何も追加しません。スイッチへのクリックはコンテナで止めるので、要素の外側のクリック検出のような、アプリ側のクリックハンドラには届きません。

</details>

<details>
<summary>SSR でも安全に使えます</summary>
<br>

どの入口も、`window` と `document` があることを確かめてから触ります。`useHaptics()` の `isSupported` は `false` で始まり、マウント後に更新されるので、サーバーの描画とハイドレーションの結果が一致します。ディレクティブはサーバーでは属性を出力しません。

</details>

<details>
<summary>npm の provenance 付きで公開しています</summary>
<br>

リリースは GitHub Actions から npm の Trusted Publishing でビルドして公開するので、npm のトークンはどこにも存在しません。各バージョンには、どのコミットとワークフローの実行からビルドしたかを示す provenance が付きます。ビルドするジョブと公開の証明書を持つジョブを分けているので、依存のどれかが乗っ取られても偽のパッケージは公開できません。

</details>

### 仕様

<details>
<summary>パターン</summary>
<br>

パターンはミリ秒の長さか、オンとオフの長さを交互に並べた配列です。形は `navigator.vibrate()` と同じです。既定値は `DEFAULT_PATTERN` の 10 です。

| パターン | Android | iOS |
| --- | --- | --- |
| `10` | 10ms 振動します | 1回鳴ります |
| `[10, 60, 10]` | 10ms オン、60ms オフ、10ms オン | 70ms 間隔で2回鳴ります |
| `0` か `[]` | 再生中のパターンを止めます | 残りの tick を取り消します |

再生中に新しく呼び出すと、前のパターンを置き換えます。iOS では1回の長さを制御できず、利用者の操作に応じたときだけ鳴ります。2回目以降の tick はタイマーで鳴らすため、iOS が捨てることがあります。

</details>

<details>
<summary>v-haptic</summary>
<br>

| 書き方 | 動作 |
| --- | --- |
| `v-haptic` | クリックで既定のパターンを鳴らします |
| `v-haptic="pattern"` | 指定したパターンを鳴らします |
| `v-haptic="false"` | 何もしません。`true` なら既定のパターンを鳴らします |
| `v-haptic:pointerdown` | `click` の代わりに指定したイベントで鳴らします |

プラグインは、渡したオプションでディレクティブを登録します。プラグインを使わない場合は、`<script setup>` で `vHaptic` を import して使います。`createHapticDirective(options)` で、独自の既定値を持つディレクティブを作れます。

</details>

<details>
<summary>関数と composable</summary>
<br>

| export | 説明 |
| --- | --- |
| `haptic(pattern?)` | パターンを鳴らします。コンポーネントの外を含め、どこからでも呼べます |
| `isHapticsSupported()` | 端末が触覚フィードバックを鳴らせるかを返します。SSR 中は `false` です |
| `useHaptics(options?)` | `trigger(pattern?)` と読み取り専用の ref の `isSupported` を返します。`trigger` は DOM のイベントを無視するので、そのままハンドラに渡せます |
| `createHaptics(options?)` | ディレクティブを登録し、アプリ全体の既定値を設定するプラグインです |
| `createHapticDirective(options?)` | 独自の既定値を持つディレクティブを作ります |

</details>

<details>
<summary>オプション</summary>
<br>

| オプション | 型 | 使う場所 | 説明 |
| --- | --- | --- | --- |
| `pattern` | `MaybeRefOrGetter<HapticPattern>` | すべて | パターンを渡さなかったときに使います |
| `disabled` | `MaybeRefOrGetter<boolean>` | すべて | true の間は鳴らしません |
| `directive` | `string \| false` | `createHaptics` | ディレクティブの名前です。既定は `"haptic"` で、`false` なら登録しません |

`useHaptics()` に渡したオプションは、プラグインのオプションより優先します。

</details>

<details>
<summary>v2 からの移行</summary>
<br>

| v2 | v3 |
| --- | --- |
| `useHaptic(duration)` | `useHaptics({ pattern: duration })` |
| `triggerHaptic()` | `trigger()` |
| `<button @click="triggerHaptic">` | `<button v-haptic>` |

既定の長さは 5ms から 10ms に変わり、Vue 3.3 以上が必要になりました。

</details>
