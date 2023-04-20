"use client"

import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

export default function TradingViewChartWidget(props) {
  console.log("Rendered Chart");
  const onLoadScriptRef = useRef();

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() {
        if (document.getElementById('tradingview_7953e') && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "CRYPTO:"+props.symbol+"USD",
            interval: "D",
            timezone: "Asia/Kolkata",
            theme: props.theme,
            style: "2",
            locale: "in",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            hide_top_toolbar: true,
            save_image: false,
            container_id: "tradingview_7953e"
          });
        }
      }
    },
    [props.height, props.symbol, props.theme, props.width]
  );

  return (
      <div id='tradingview_7953e' style={{height: "100%", width:"100%"}}/>
  );
}

