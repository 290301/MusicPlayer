const playList = document.querySelector('.playlist');
const header = document.querySelector('.header h2');
const audio = document.querySelector('#audio');
const cdThumb = document.querySelector('.cd-thumb');
const btnPlay = document.querySelector('.btn-toggle-play');
const songPlay = document.querySelector('.playSong');
const songPause = document.querySelector('.pauseSong');
const progress = document.querySelector('#progress');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const btnRandom = document.querySelector('.btn-random');
const btnRepeat = document.querySelector('.btn-repeat');
const songs = document.querySelectorAll('.song');
const songPlaying = document.querySelector('.song.playing');



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Ai chung tình được mãi',
            singer: 'Đinh Tùng Huy',
            path: './music/AiChungTinhDuocMai.mp3',
            image: './image/AiChungTinhDuocMai.jpg'
        },
        {
            name: 'Duyên duyên số số',
            singer: 'Du Uyên',
            path: './music/DuyenDuyenSoSo.mp3',
            image: './image/DuyenDuyenSoSo.jpg'
        },
        {
            name: 'Em của ngày hôm qua',
            singer: 'Sơn Tùng MTP',
            path: './music/EmCuaNgayHomQua.mp3',
            image: './image/EmCuaNgayHomQua.jpg'
        },
        {
            name: 'Hãy trao cho anh',
            singer: 'Sơn Tùng MTP',
            path: './music/HayTraoChoAnh.mp3',
            image: './image/HayTraoChoAnh.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: './music/MuonRoiMaSaoCon.mp3',
            image: './image/MuonRoiMaSaoCon.jpg'
        },
        {
            name: 'Và ngày nào đó',
            singer: 'Quang Trung - Thảo My',
            path: './music/VaNgayNaoDo.mp3',
            image: './image/VaNgayNaoDo.jpg'
        }, {
            name: 'Em nên dừng lại',
            singer: 'Khang Việt',
            path: './music/EmNenDungLai.mp3',
            image: './image/EmNenDungLai.jpg'
        },
        {
            name: 'Tay nắm tay rời',
            singer: 'Phạm Đình Thái Ngân',
            path: './music/TayNamTayRoi.mp3',
            image: './image/TayNamTayRoi.jpg'
        }

    ],

    renderSong: function () {
        app.songs.forEach(function (song, index) {
            const html = `
                <div class="song" data-index="${index}">
                     <div class="thumb">
                        <image src='${song.image}'></image>
                    </div>
                    <div class="body">
                        <div class="title">${song.name}</div>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                </div>
            `;

            playList.innerHTML += html;
        })
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const cdThumb_width = cdThumb.offsetWidth;
        const cdThumb_height = cdThumb.offsetHeight;

        //----------------------- Xử lý phóng to thu nhỏ CD -----------------------
        // playList.onscroll = function () {
        //     const newSize = cdThumb_width - playList.scrollTop;
        //     cdThumb.style.height = newSize + 'px';
        //     cdThumb.style.width = newSize + 'px';
        // }


        // ----------------------- Xử lý CD quay và dừng -----------------------
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 20000, // 10s
            iterations: Infinity // Quay vô hạn
        });
        cdThumbAnimate.pause();

        //----------------------- Xử lý khi click play audio -----------------------
        btnPlay.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }
        // ------ Khi bài hát được play
        audio.onplay = function () {
            app.isPlaying = true;
            songPlay.style.display = 'none';
            songPause.style.display = 'inline-flex';
            cdThumbAnimate.play();
            console.log(progress);


        }
        // ------ Khi bài hát bị pause
        audio.onpause = function () {
            app.isPlaying = false;
            songPlay.style.display = 'inline-flex';
            songPause.style.display = 'none';
            cdThumbAnimate.pause();
        }

        // ------ Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // ------ Khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // ------ Khi next bài hát
        btnNext.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
        };

        // ------ Khi prev bài hát
        btnPrev.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            audio.play();
        }

        // ------ Bật tắt random bài hát
        btnRandom.onclick = function () {
            app.isRandom = !app.isRandom;
            btnRandom.classList.toggle('playing', app.isRandom);
        }

        // ------ Bật tắt repeat bài hát
        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat;
            btnRepeat.classList.toggle('playing', app.isRepeat);
        }

        // ------ Khi audio kết thúc bài hát
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        }
        // ------ Lắng nghe hành vi click  trong playlist
        playList.onclick = function (e) {
            if (e.target.closest('.song:not(.playing)') || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (e.target.closest('.song:not(.playing)') && !e.target.closest('.option')) {
                    app.currentIndex = Number(e.target.closest('.song:not(.playing)').getAttribute('data-index'));
                    // hoặc có thể dùng cách này
                    // app.currentIndex = Number(e.target.closest('.song:not(.playing)').dataset.index);
                    app.loadCurrentSong();
                    audio.play();
                }
                // Xử lý khi click vào song option
                if (e.target.closest('.option')) {
                    alert("Song" + e.target.closest('.song').getAttribute('data-index'));
                }

            }
            else {
            }

        }

    },

    loadCurrentSong: function () {
        const songs = document.querySelectorAll('.song');
        const songPlaying = document.querySelector('.song.playing');

        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = `${this.currentSong.path}`;

        if (songPlaying) {
            songPlaying.classList.remove('playing');
        }
        songs[this.currentIndex].classList.add('playing');
        app.scrollToActiveSong();
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    repeatSong: function () {
        this.currentIndex = this.currentIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            document.querySelector('.song.playing').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300)
    },

    start: function () {

        //--- Hiển thị danh sách bài hát
        this.renderSong();

        //---- Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        //--- Lắng nghe /  xử lý các sự kiện (DOM events)
        this.handleEvents();

        //--- Tải thông tin bài hát hiện tại
        this.loadCurrentSong();


    }
}

app.start();


