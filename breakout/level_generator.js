class LevelGenerator {
    static color(n) {
        const colors = ["#F92672", "#66D9EF", "#A6E22E", "#FD971F", "#AE81FF", "#FFE792", "#FFE792"];
        return colors[n % colors.length];
    }

    // level 1
    static hardcoded1() {
        var blocks = [];

        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 8; col++) {
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, this.color(row)));
            }
        }

        return blocks;
    }

    // level 2
    static hardcoded2() {
        var blocks = [];

        for (let row = 0; row < 3; row++) {
            for (let col = 1; col < 7; col++) {
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, this.color(row)));
            }
        }

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 8; col++) {
                if (col == 2 || col == 5) continue;
                blocks.push(new Block(2+col*60, 160+row*20, 58, 16, this.color(row)));
            }
        }

        for (let col = 0; col < 8; col++) {
            blocks.push(new Block(2+col*60, 240, 58, 16, "grey", 2));
        }

        return blocks;
    }

    // level 3
    static hardcoded3() {
        var blocks = [];

        blocks.push(new Block(60, 60, 16, 196, "grey", 2));
        blocks.push(new Block(480-76, 60, 16, 196, "grey", 2));

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 6; col++) {
                blocks.push(new Block(80+col*54, 60+row*20, 50, 16, this.color(row)));
            }
        }
        for (let row = 0; row < 4; row++) {
            blocks.push(new Block(80, 120+row*20, 50, 16, this.color(2)));
            blocks.push(new Block(480-130, 120+row*20, 50, 16, this.color(2)));
        }

        for (let col = 0; col < 2; col++) {
            blocks.push(new Block(134+col*108, 120, 104, 76, this.color(5)));
        }

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 6; col++) {
                blocks.push(new Block(80+col*54, 200+row*20, 50, 16, this.color(2-row)));
            }
        }

        for (let col = 0; col < 6; col++) {
            blocks.push(new Block(80+col*54, 260, 50, 16, "grey", 2));
        }

        return blocks;
    }

    // simple random level
    randomLevel() {
        var blocks = [];

        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 8; col++) {
                if (Math.random() >= 0.5) continue;
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, this.color(row)));
            }
        }

        return blocks;
    }

    static getLevel(n) {
        switch(n) {
            case 1: return this.hardcoded1();
            case 2: return this.hardcoded2();
            case 3: return this.hardcoded3();
            case 4: return this.hardcoded4();
        }
        return randomLevel();
    }

    static numLevels() {
        return 3;
    }
}
