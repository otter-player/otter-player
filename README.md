<p align="center">
<img alt="Logo Banner" src="https://raw.githubusercontent.com/otter-player/otter-player/main/banner/banner.svg?sanitize=true"/>
<br/>

<div align="left">Its cute just like an Otter.</div>
<div align="left">

<!--[Documentation]()-->
<!--[Discord]()-->

</div>

## Features

- Feature 1.
- Feature 2.
- Feature 3.

## Installation

### CDN

Install The Otter Player using CDN.

```<head>```

```html
<script type="module" src="https://unpkg.com/otter-player"></script>
```

#### 🚧 Specific Version
```html
<script type="module" src="https://unpkg.com/otter-player@latest"></script>
```

## Usage Example

Use the Otter Player Markup in your HTML. That's it 🎉.

```HTML```

```HTML
<otter-player title="Sprite Fight" poster="https://files.vidstack.io/sprite-fight/poster.webp" src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8">
  <otter-layout></otter-layout>
</otter-player>
```

Check out the demo on [Codepen](https://codepen.io/GreenestGoat/pen/QWRxNYb).

## Attributes

```src```

```poster```

```loop```

```muted```

```volume```

```autoplay```

```preload```

| auto | metadata | none |
|------|----------|------|

```crossorigin```

```playsinline```

```disabled```

```disable-controls```

```disable-spinner```

```disable-volume-slider```

```disable-seek-bar```

```disable-title```

```disable-center-controls```

```disable-seek-buttons```

```disable-seek-left-button```

```disable-seek-right-button```

```disable-play-pause-button```

## Customization

The Otter Player can be easily customized by altering the players default variables in the ```:root``` of your CSS.

```CSS```

```CSS
:root {
  /* otter player default variables */

  /* otter player variables */
  --otter-player-width: 100%;
  --otter-player-height: 100%;
  --otter-player-background-color: #000000;
  --otter-player-border-radius: 15px;
  --otter-player-object-fit: contain;
  --otter-player-transition: all 0.15s ease;
  --otter-player-font-family: "Roboto", sans-serif;
  --otter-player-disabled-opacity: 0.5;

  /* otter button variables */
  --otter-button-size: 66px;
  --otter-button-height: var(--otter-button-size);
  --otter-button-width: var(--otter-button-size);
  --otter-button-border-radius: 100%;
  --otter-button-cursor: pointer;
  --otter-button-transition: all 0.05s ease;
  --otter-button-background-color-initial: rgba(255, 255, 255, 0);
  --otter-button-background-color-hover: rgba(255, 255, 255, 0.28);
  --otter-button-background-filter-initial: blur(0px);
  --otter-button-background-filter-hover: blur(45px);
  --otter-button-disabled-opacity: 0.5;
  --otter-button-icon-scale-down-by: 14px;
  --otter-button-icon-color: #ffffff;
  --otter-button-outline: none;
  --otter-button-border: none;
  
  /* otter slider variables */
  --otter-slider-rotate: 270deg;
  --otter-slider-height: 8px;
  --otter-slider-width: 180px;
  --otter-slider-outline: none;
  --otter-slider-border: none;
  --otter-slider-cursor: pointer;
  --otter-slider-transition: none;
  --otter-slider-border-radius: 9999px;
  --otter-slider-background-color: rgba(255, 255, 255, 0.28);
  --otter-slider-backdrop-filter: blur(45px);
  --otter-slider-progress-color: #ffffff;
  --otter-slider-thumb-size: 26px;
  --otter-slider-thumb-height: var(--otter-slider-thumb-size);
  --otter-slider-thumb-width: var(--otter-slider-thumb-size);
  --otter-slider-thumb-color: #ffffff;
  --otter-slider-thumb-border-radius: 100%;
  --otter-slider-thumb-transition: background .3s ease-in-out;
  --otter-slider-thumb-box-shadow: 0 0 2px 0 #555555;
  --otter-slider-thumb-outline: 0px solid rgba(255, 255, 255, 0.28);
  --otter-slider-thumb-active-outline: 7px solid rgba(255, 255, 255, 0.28);
  
  /* otter seek bar container variables */
  --otter-seek-bar-container-width: calc(var(--otter-player-width) - 68px);
  --otter-seek-bar-container-height: 100%;
  
  /* otter seek bar variables */
  --otter-seek-bar-rotate: 0deg;
  --otter-seek-bar-height: 6px;
  --otter-seek-bar-width: 100%;
  --otter-seek-bar-outline: none;
  --otter-seek-bar-border: none;
  --otter-seek-bar-cursor: pointer;
  --otter-seek-bar-transition: none;
  --otter-seek-bar-border-radius: 9999px;
  --otter-seek-bar-background-color: rgba(255, 255, 255, 0.28);
  --otter-seek-bar-backdrop-filter: blur(45px);
  --otter-seek-bar-progress-color: #ffffff;
  --otter-seek-bar-thumb-size: 22px;
  --otter-seek-bar-thumb-height: var(--otter-seek-bar-thumb-size);
  --otter-seek-bar-thumb-width: var(--otter-seek-bar-thumb-size);
  --otter-seek-bar-thumb-color: #ffffff;
  --otter-seek-bar-thumb-border-radius: 100%;
  --otter-seek-bar-thumb-transition: background .3s ease-in-out;
  --otter-seek-bar-thumb-box-shadow: 0 0 2px 0 #555555;
  --otter-seek-bar-thumb-outline: 0px solid rgba(255, 255, 255, 0.28);
  --otter-seek-bar-thumb-active-outline: 7px solid rgba(255, 255, 255, 0.28);
  
  /* otter spinner variables */
  --otter-spinner-z-index: 9999;
  --otter-spinner-size: calc(var(--otter-button-size) + 22px);
  --otter-spinner-height: var(--otter-spinner-size);
  --otter-spinner-width: var(--otter-spinner-size);
  --otter-spinner-border: 5px solid rgba(255, 255, 255, 0.70);
  --otter-spinner-border-left-color: transparent;
  --otter-spinner-border-radius: 100%;
  --otter-spinner-animation: otter-spinner 1s linear infinite;
  --otter-spinner-transform-0-percent: rotate(0deg);
  --otter-spinner-transform-100-percent: rotate(360deg);
  
  /* otter title variables */
  --otter-title-width: fit-content;
  --otter-title-height: fit-content;
  --otter-title-color: #ffffff;
  --otter-title-font-family: var(--otter-player-font-family);
  --otter-title-font-size: 24px;
  --otter-title-font-weight: 400;
  --otter-title-margin-left: 34px;
  
  /* otter play/pause spacer */
  --otter-play-pause-spacer: 132px;
    
  /* otter top/bottom height */  
  --otter-top-bottom-height: 84px;
  
  /* otter volume/brightness width */ 
  --otter-volume-brightness-width: 104px;
}
```

## To do

- [ ] Caption support.
- [ ] Add support for React.

<!--## Backers

Thank you to all our backers! 🙏.

[![Backers](https://opencollective.com/bootstrap/backers.svg?width=890)](https://opencollective.com/bootstrap#backers)-->


## Copyright and license

Licensed under the MIT License, Copyright © 2024-present otter-player.

See [LICENSE](https://github.com/otter-player/otter-player/blob/main/LICENSE) for more information.
