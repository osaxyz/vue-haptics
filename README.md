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
> vue-haptics requires Vue 3.3 or later. A tap on an element with `v-haptic` plays one haptic tick on Android browsers with the Vibration API and on iOS Safari 18 or later; elsewhere, it does nothing. v4.0.0 removed vibration patterns and calling haptics from script, because iOS 26.5 and later play haptics only for a real tap.

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
  <button v-haptic @click="save">Save</button>
</template>
```

4. Open the page on a phone and tap the button. You should feel a short tick on Android and on iPhone.

> [!TIP]
> Pass `disabled: () => !settings.haptics` to `createHaptics()` to let users turn haptics off across the whole app.

### Technology

<details>
<summary>Haptics on iOS Safari without the Vibration API</summary>
<br>

iOS Safari does not implement `navigator.vibrate()`, but it plays a system haptic when the user toggles an `<input type="checkbox" switch>`. Since iOS 26.5, a switch toggled from script, including through `label.click()`, plays nothing; only a real tap does. So on iOS, `v-haptic` places a transparent label holding a switch over the element, and the user's own tap lands on that label.

| Environment | How it plays |
| --- | --- |
| Android Chrome and other browsers with the Vibration API | `navigator.vibrate(10)` on click |
| iOS Safari 18 or later | A transparent label over the element toggles a switch on each tap |
| Others, and SSR | Does nothing |

The idea of using `<input switch>` comes from [use-haptic](https://github.com/posaune0423/use-haptic) by Asuma Yamada, and the overlay that works on iOS 26.5 follows [ios-haptics](https://github.com/tijnjh/ios-haptics). vue-haptics started as a Vue port of use-haptic.

</details>

<details>
<summary>The overlay stays out of the way</summary>
<br>

The tap still reaches the element's own click handlers exactly once. The switch is kept out from under the finger, so a gesture that starts on the element can still scroll the page. If Vue rewrites the element's children, the overlay is put back, and it is removed when the element unmounts.

</details>

<details>
<summary>SSR safe</summary>
<br>

The directive renders nothing on the server and only touches the DOM after mount. `isHapticsSupported()` returns `false` during SSR.

</details>

<details>
<summary>Published with npm provenance</summary>
<br>

Releases are built and published from GitHub Actions with npm Trusted Publishing, so no npm token exists anywhere. Each version carries a provenance statement that links it to the commit and workflow run it was built from. The build job and the job that holds the publishing credential are separate, so a compromised dependency cannot publish a fake package. The workflow only stages each version, and it reaches users after a maintainer approves it with two-factor authentication.

</details>

### Specification

<details>
<summary>v-haptic</summary>
<br>

| Usage | Behavior |
| --- | --- |
| `v-haptic` | Plays one tick when the element is tapped |
| `v-haptic="false"` | Does nothing. `true` turns it back on |

On iOS, an element with `position: static` gets `position: relative` so the overlay can cover it, and its original position is restored on unmount. The overlay covers the whole element, so use `v-haptic` on controls such as buttons rather than on containers with links or inputs inside. In click handlers, `event.target` can be the overlay; use `event.currentTarget` to get the element.

</details>

<details>
<summary>Exports</summary>
<br>

| Export | Description |
| --- | --- |
| `vHaptic` | The directive. Import it in `<script setup>` when you do not use the plugin |
| `createHaptics(options?)` | Plugin that registers the directive globally |
| `createHapticDirective(options?)` | Builds a directive with its own options |
| `isHapticsSupported()` | Whether the device can play haptics. `false` during SSR |

| Option | Type | Description |
| --- | --- | --- |
| `disabled` | `MaybeRefOrGetter<boolean>` | Suppresses haptics while true. Read at the moment of each tap |
| `directive` | `string \| false` | `createHaptics` only. Name of the directive, `"haptic"` by default. `false` skips registration |

</details>

<details>
<summary>Migrating from v3</summary>
<br>

| v3 | v4 |
| --- | --- |
| `v-haptic="40"`, `v-haptic="[10, 60, 10]"` | `v-haptic`. Every tap plays one tick |
| `v-haptic:pointerdown` | `v-haptic`. Haptics play on click |
| `haptic()`, `useHaptics().trigger()` | Removed. Put `v-haptic` on the element the user taps |
| `useHaptics().isSupported` | `isHapticsSupported()` after mount |
| `pattern` option, `HapticPattern`, `DEFAULT_PATTERN`, `HAPTICS_KEY` | Removed |

</details>

<a id="ja"></a>

## 日本語

<p align="center">
  <a href="https://github.com/osaxyz/vue-haptics"><img src="https://img.shields.io/github/stars/osaxyz/vue-haptics?style=social" alt="Star vue-haptics on GitHub"></a><br>
  <sub>vue-haptics が役に立ったら、スターを付けてもらえると励みになります。</sub>
</p>

> [!IMPORTANT]
> vue-haptics には Vue 3.3 以上が必要です。`v-haptic` を付けた要素をタップすると、Vibration API のある Android のブラウザと iOS Safari 18 以上で、触覚フィードバックが1回鳴ります。それ以外の環境では何も起きません。iOS 26.5 以降は実際のタップでしか鳴らないため、v4.0.0 で振動のパターンとスクリプトから鳴らす機能を廃止しました。

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
  <button v-haptic @click="save">Save</button>
</template>
```

4. スマホでページを開いてボタンを押します。Android でも iPhone でも、短い振動が返ってくれば動いています。

> [!TIP]
> `createHaptics()` に `disabled: () => !settings.haptics` を渡すと、アプリ全体の触覚フィードバックを利用者の設定でオフにできます。

### テクノロジー

<details>
<summary>Vibration API のない iOS Safari でも鳴らせます</summary>
<br>

iOS Safari は `navigator.vibrate()` を実装していませんが、利用者が `<input type="checkbox" switch>` を切り替えるとシステムの触覚フィードバックを鳴らします。iOS 26.5 からは、`label.click()` を含めスクリプトから切り替えても鳴らず、実際のタップでしか鳴りません。そこで iOS では、`v-haptic` が要素の上にスイッチを持つ透明な label を重ね、利用者のタップがその label に直接当たるようにしています。

| 環境 | 鳴らし方 |
| --- | --- |
| Android Chrome など Vibration API のあるブラウザ | クリックで `navigator.vibrate(10)` |
| iOS Safari 18 以上 | 要素に重ねた透明な label が、タップごとにスイッチを切り替えます |
| それ以外と SSR | 何もしません |

`<input switch>` を使う発想は Asuma Yamada さんの [use-haptic](https://github.com/posaune0423/use-haptic) によるもので、iOS 26.5 でも動く重ね方は [ios-haptics](https://github.com/tijnjh/ios-haptics) に倣っています。vue-haptics は use-haptic の Vue への移植として始まりました。

</details>

<details>
<summary>重ねた label は操作の邪魔をしません</summary>
<br>

タップは、要素の click のハンドラにもちょうど1回届きます。スイッチは指の下に置かないので、要素の上で始めた操作でもページをスクロールできます。Vue が要素の子を書き換えても label は付け直され、要素がアンマウントされると取り除かれます。

</details>

<details>
<summary>SSR でも安全に使えます</summary>
<br>

ディレクティブはサーバーでは何も出力せず、マウントした後にだけ DOM に触ります。`isHapticsSupported()` は SSR 中は `false` を返します。

</details>

<details>
<summary>npm の provenance 付きで公開しています</summary>
<br>

リリースは GitHub Actions から npm の Trusted Publishing でビルドして公開するので、npm のトークンはどこにも存在しません。各バージョンには、どのコミットとワークフローの実行からビルドしたかを示す provenance が付きます。ビルドするジョブと公開の証明書を持つジョブを分けているので、依存のどれかが乗っ取られても偽のパッケージは公開できません。ワークフローは各バージョンを段階公開するだけで、メンテナーが 2 要素認証を使って承認してから利用者に届きます。

</details>

### 仕様

<details>
<summary>v-haptic</summary>
<br>

| 書き方 | 動作 |
| --- | --- |
| `v-haptic` | 要素をタップすると1回鳴らします |
| `v-haptic="false"` | 何もしません。`true` に戻すと鳴らします |

iOS では、label で覆えるよう `position: static` の要素に `position: relative` を付け、アンマウントすると元に戻します。label は要素全体を覆うので、`v-haptic` はボタンのような操作の部品に付け、リンクや入力欄を中に持つ入れ物には付けないでください。click のハンドラでは `event.target` が label になることがあるので、要素は `event.currentTarget` で取ります。

</details>

<details>
<summary>export</summary>
<br>

| export | 説明 |
| --- | --- |
| `vHaptic` | ディレクティブです。プラグインを使わないときは `<script setup>` で import します |
| `createHaptics(options?)` | ディレクティブを全体に登録するプラグインです |
| `createHapticDirective(options?)` | 独自のオプションを持つディレクティブを作ります |
| `isHapticsSupported()` | 端末が触覚フィードバックを鳴らせるかを返します。SSR 中は `false` です |

| オプション | 型 | 説明 |
| --- | --- | --- |
| `disabled` | `MaybeRefOrGetter<boolean>` | true の間は鳴らしません。タップした時点の値で判断します |
| `directive` | `string \| false` | `createHaptics` だけで使います。ディレクティブの名前で、既定は `"haptic"` です。`false` なら登録しません |

</details>

<details>
<summary>v3 からの移行</summary>
<br>

| v3 | v4 |
| --- | --- |
| `v-haptic="40"`、`v-haptic="[10, 60, 10]"` | `v-haptic`。タップごとに1回鳴ります |
| `v-haptic:pointerdown` | `v-haptic`。クリックで鳴ります |
| `haptic()`、`useHaptics().trigger()` | 廃止しました。利用者がタップする要素に `v-haptic` を付けます |
| `useHaptics().isSupported` | マウント後に `isHapticsSupported()` |
| `pattern` オプション、`HapticPattern`、`DEFAULT_PATTERN`、`HAPTICS_KEY` | 廃止しました |

</details>
