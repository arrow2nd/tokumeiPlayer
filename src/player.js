'use strict';
const app = window.app;
const dialog = window.dialog;
const shell = window.shell;

const audioElem = new Audio();
const inputArea = $('#inputArea');
const playButton = $('#playButton');
const prevButton = $('#prevButton');
const nextButton = $('#nextButton');
const searchButton = $('#searchButton');
const shuffleButton = $('#shuffleButton');
const exitButton = $('#exitButton');
const seekbar = $('#seekbar');
let seek;

// シークバーの位置を更新
const seekbarUpdate = () => {
    const now = Math.round(audioElem.currentTime);
    seekbar.val(now);
};

// 最新回を取得
let latestRadioNumber = 198;
$.ajax({
    type: 'GET',
    url: 'https://omocoro.jp/tag/%E5%8C%BF%E5%90%8D%E3%83%A9%E3%82%B8%E3%82%AA/'
}).done((data) => {
    const title = $(data).find('.title')[0];
    const text =$(title).text();
    const indexOfFirst = text.indexOf('【');
    if (indexOfFirst === -1) {
        dialog.showErrorBox('エラー', 'データの解析に失敗しました');
    } else {
        latestRadioNumber = Number(text.substr(indexOfFirst + 1, 3));
    };
    inputArea.val(latestRadioNumber);
}).fail((error) => {
    dialog.showErrorBox('エラー', '最新回の取得に失敗しました');
});

// 再生停止ボタン
playButton.on('click', () => playControl());

// 入力エリアでEnter
inputArea.on('keypress', (e) => {
    if (e.which === 13) {
        playControl();
    };
});

// 前へボタン
prevButton.on('click', () => prevTrack());

// 次へボタン
nextButton.on('click', () => nextTlack());

// 検索ボタン
searchButton.on('click', () => {
    const nowPlaying = inputArea.val() == 0 ? '001' : ('000' + inputArea.val()).slice(-3);
    shell.openExternal(`https://omocoro.jp/?s=${decodeURIComponent(`【${nowPlaying}】ARuFa・恐山の匿名ラジオ`)}`);
});

// シャッフルボタン 
shuffleButton.on('click', () => {
    if (shuffleButton.css('filter') === 'brightness(0.5)') {
        shuffleButton.css({'filter': 'brightness(1)'});
    } else {
        shuffleButton.css({'filter': 'brightness(0.5)'});
    };
});

// 終了ボタン
exitButton.on('click', () => {
    app.quit(); 
});

// シーク中
seekbar.on('mousedown', () => {
    clearInterval(seek);
});

// シーク反映
seekbar.on('change', () => {
    const seekOfs = seekbar.val();
    audioElem.currentTime = seekOfs;
});


// 再生可能（開始した）
audioElem.oncanplaythrough = () => {
    if (playButton.attr('src') === '../img/pause.png') {
        const seekbarMax = Math.round(audioElem.duration);
        seekbar.attr('max', seekbarMax);
        clearInterval(seek);
        seek = setInterval(seekbarUpdate, 1000);
    };
};

// 再生終了
audioElem.onended = () => {
    // 次の回を指定
    if (shuffleButton.css('filter') === 'brightness(0.5)') {
        nextTlack();
    } else {
        const randomNo = Math.ceil(Math.random() * latestRadioNumber);
        inputArea.val(randomNo);
    };
    stopRadio();
    const nowRadioNumber = Number(inputArea.val());
    playRadio(nowRadioNumber);
};

// ファイルが存在しない
audioElem.onerror = () => {
    const nowRadioNumber = Number(inputArea.val());
    dialog.showErrorBox('再生できません', `匿名ラジオ 第${nowRadioNumber}回は見つかりませんでした`);        
    playButton.attr('src', '../img/play.png');
    stopRadio();
};


/**
 * 数字入力フォームの値を制限
 * @param {*} element 要素
 */
function limitValue(element) {  
    const value = Number(element.value.slice(0, 3));
    if (element.value === 0 ) {
        element.value = 1;
    };
    element.value = value>latestRadioNumber ? latestRadioNumber : value;
};

/**
 * 再生・停止振り分け
 */
function playControl() {
    if (playButton.attr('src') === '../img/pause.png') {
        playButton.attr('src', '../img/play.png');
        stopRadio();
        return;
    };
    playButton.attr('src', '../img/pause.png');
    const nowRadioNumber = Number(inputArea.val());
    playRadio(nowRadioNumber);
};

/**
 * 再生開始
 * @param {*} number 再生する回
 */
function playRadio(number) {
    const radioNo = number == 0 ? '001' : ('000' + number).slice(-3);
    const url = `https://omocoro.heteml.net/radio/tokumei/${radioNo}.mp3`;
    if (audioElem.src !== url) {
        audioElem.src = url;
        seekbar.val(0);
    } else {
        const nowSeekOfs = Math.round(audioElem.currentTime);
        seekbar.val(nowSeekOfs);
        clearInterval(seek);
        seek = setInterval(seekbarUpdate, 1000);
    };
    audioElem.play();
};

/**
 * 再生停止
 */
function stopRadio() {
    clearInterval(seek);
    audioElem.pause();
};

/**
 * 次のトラックを指定
 */
function nextTlack() {
    let nowRadioNumber = Number(inputArea.val());
    nowRadioNumber = nowRadioNumber === 0 ? 1 : nowRadioNumber;
    const radioNumber = nowRadioNumber + 1 > latestRadioNumber ? 1 : nowRadioNumber + 1;
    inputArea.val(radioNumber);
};

/**
 * 前のトラックを指定
 */
function prevTrack() {
    const nowRadioNumber = Number(inputArea.val());
    const radioNumber = nowRadioNumber - 1 < 1 ? latestRadioNumber : nowRadioNumber - 1;
    inputArea.val(radioNumber);
};
