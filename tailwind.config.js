// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // appディレクトリを使っている場合
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a2dae7', //テーマカラー
        choiceBtn: '#eafaff', // cspell:ignore eafaff ボタンカラー



    },
  },
  plugins: [],
}
}