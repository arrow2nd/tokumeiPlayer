'use strict';
const app = window.app;
const dialog = window.dialog;
const shell = window.shell;
const audioElem = new Audio();
const form = $('#inputArea');
const playBtn = $('#playButton');
const prevBtn = $('#prevButton');
const nextBtn = $('#nextButton');
const searchBtn = $('#searchButton');
const shuffleBtn = $('#shuffleButton');
const exitBtn = $('#exitButton');
const seekbar = $('#seekbar');
let seek;


// 画像のドラッグを禁止
$(function () {
    $('.copyProtection').attr('onmousedown', 'return false');
    $('.copyProtection').attr('onselectstart', 'return false');
});

// 最新回を取得
let latestRadioNum = 200;
$.ajax({
    type: 'GET',
    url: 'https://omocoro.jp/tag/%E5%8C%BF%E5%90%8D%E3%83%A9%E3%82%B8%E3%82%AA/'
}).done((data) => {
    const title = $(data).find('.title')[0];
    const text = $(title).text();
    const indexOfFirst = text.indexOf('【');
    if (indexOfFirst == -1) {
        dialog.showErrorBox('エラー', 'データの解析に失敗しました');
    } else {
        latestRadioNum = Number(text.substr(indexOfFirst + 1, 3));
    };
    form.val(latestRadioNum);
}).fail(() => {
    dialog.showErrorBox('エラー', '最新回の取得に失敗しました');
});


// 再生停止ボタン
playBtn.on('click', () => control());

// 入力エリアでEnter
form.on('keypress', (e) => {
    if (e.which == 13) {
        control();
    };
});

// 前へボタン
prevBtn.on('click', () => prevTrack());

// 次へボタン
nextBtn.on('click', () => nextTlack());

// 検索ボタン
searchBtn.on('click', () => {
    const nowPlaying = (form.val() == 0) ? '001' : ('000' + form.val()).slice(-3);
    shell.openExternal(`https://omocoro.jp/?s=${decodeURIComponent(`【${nowPlaying}】ARuFa・恐山の匿名ラジオ`)}`);
});

// シャッフルボタン
shuffleBtn.on('click', () => {
    if (shuffleBtn.css('filter') == 'brightness(0.5)') {
        shuffleBtn.css({'filter': 'brightness(1)'});
    } else {
        shuffleBtn.css({'filter': 'brightness(0.5)'});
    };
});

// 終了ボタン
exitBtn.on('click', () => app.quit());

// シーク中
seekbar.on('mousedown', () => clearInterval(seek));

// シーク反映
seekbar.on('change', () => {
    const seekOfs = seekbar.val();
    audioElem.currentTime = seekOfs;
});

// 再生可能（開始した）
audioElem.oncanplaythrough = () => {
    if (playBtn.attr('src') == '../img/pause.png') {
        const seekbarMax = Math.round(audioElem.duration);
        seekbar.attr('max', seekbarMax);
        clearInterval(seek);
        seek = setInterval(updateSeekbar, 1000);
    };
};

// 再生終了
audioElem.onended = () => {
    // 次の回を指定
    if (shuffleBtn.css('filter') == 'brightness(0.5)') {
        nextTlack();
    } else {
        const randomNo = Math.ceil(Math.random() * latestRadioNum);
        form.val(randomNo);
    };
    stopRadio();
    const nowRadioNumber = Number(form.val());
    playRadio(nowRadioNumber);
};

// 存在しない
audioElem.onerror = () => {
    const nowRadioNumber = Number(form.val());
    dialog.showErrorBox('再生できません', `匿名ラジオ 第${nowRadioNumber}回は見つかりませんでした`);        
    playBtn.attr('src', '../img/play.png');
    stopRadio();
};


/**
 * シークバーの位置を更新
 */
const updateSeekbar = () => {
    const now = Math.round(audioElem.currentTime);
    seekbar.val(now);
};

/**
 * 数字入力フォームの値を制限
 * @param {Object} element 要素
 */
function limitValue(element) {  
    const value = Number(element.value.slice(0, 3));
    element.value = (latestRadioNum < value) ? latestRadioNum : value;
};

/**
 * 再生・停止振り分け
 */
function control() {
    if (playBtn.attr('src') == '../img/pause.png') {
        playBtn.attr('src', '../img/play.png');
        stopRadio();
        return;
    };
    playBtn.attr('src', '../img/pause.png');
    let radioNum = Number(form.val());
    if (radioNum == 0) {
        radioNum = 1;
        form.val(1);
    };
    playRadio(radioNum);
};

/**
 * 再生開始
 * @param {Number} number 再生する回
 */
function playRadio(number) {
    const radioNo = (number == 0) ? '001' : ('000' + number).slice(-3);
    const url = `https://omocoro.heteml.net/radio/tokumei/${radioNo}.mp3`;
    if (audioElem.src !== url) {
        audioElem.src = url;
        seekbar.val(0);
    } else {
        const nowSeekOfs = Math.round(audioElem.currentTime);
        seekbar.val(nowSeekOfs);
        clearInterval(seek);
        seek = setInterval(updateSeekbar, 1000);
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
    let radioNumber = Number(form.val());
    radioNumber++;
    radioNumber = (latestRadioNum < radioNumber) ? 1 : radioNumber;
    form.val(radioNumber);
};

/**
 * 前のトラックを指定
 */
function prevTrack() {
    let radioNumber = Number(form.val());
    radioNumber--;
    radioNumber = (radioNumber < 1) ? latestRadioNum : radioNumber;
    form.val(radioNumber);
};
