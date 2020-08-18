(function ($db) {
    let Cron = function () {
        let temp = this;
        this.Seconds = new Int32Array(60);
        this.Minutes = new Int32Array(60);
        this.Hours = new Int32Array(24);
        this.Days = new Int32Array(31);
        this.Month = new Int32Array(12);
        this.Weeks = new Int32Array(7);
        this.Year = new Int32Array(80);

        for (let i = 0; i < 60; i++) {
            this.Seconds[i] = 0;
            this.Minutes[i] = 0;
        }
        for (let i = 0; i < 24; i++) {
            this.Hours[i] = 0;
        }
        for (let i = 0; i < 31; i++) {
            this.Days[i] = 0;
        }
        for (let i = 0; i < 12; i++) {
            this.Month[i] = 0;
        }
        for (let i = 0; i < 7; i++) {
            this.Weeks[i] = 0;
        }
        for (let i = 0; i < 80; i++) {
            this.Year[i] = 0;
        }
        this.Init = function Init() {
            for (let i = 0; i < 7; i++) {
                temp.Weeks[i] = 0;
            }
            for (let i = 0; i < 31; i++) {
                temp.Days[i] = 0;
            }
        }
    }

    function CronAnalytice(cronExpression, now, num = 7) {
        try {
            let datetimes = [];
            let c = new Cron();
            let nowTime = new Date(now);
            let arr = cronExpression.split(" ");
            Seconds(c, arr[0]);
            Minutes(c, arr[1]);
            Hours(c, arr[2]);
            Month(c, arr[4]);
            if (arr.length < 7) {
                Year(c, null);
            }
            else {
                Year(c, arr[6]);
            }
            let addtime = 1;
            while (true) {
                if (c.Seconds[nowTime.getSeconds()] == 1
                    && c.Minutes[nowTime.getMinutes()] == 1
                    && c.Hours[nowTime.getHours()] == 1
                    && c.Month[nowTime.getMonth()] == 1
                    && c.Year[nowTime.getFullYear() - new Date().getFullYear()] == 1) {
                    if (arr[3] != "?") {
                        Days(c, arr[3], new Date(nowTime.getFullYear(), nowTime.getMonth() + 1, 0).getDate(), nowTime);
                        let DayOfWeek = ((nowTime.getDay()) + 6) % 7;
                        if (c.Days[nowTime.getDate() - 1] == 1 && c.Weeks[DayOfWeek] == 1) {
                            datetimes.push(new Date(nowTime));
                        }
                        else if (c.Days[nowTime.getDate() - 1] == 2 && c.Weeks[DayOfWeek] == 1) {
                            let daydate = new Date(nowTime);
                            daydate.setDate(daydate.getDate() - 1);
                            datetimes.push(daydate);
                        }
                        else if (c.Days[nowTime.getDate() - 1] == 3 && c.Weeks[DayOfWeek] == 1) {
                            let daydate = new Date(nowTime);
                            daydate.setDate(daydate.getDate() + 1);
                            datetimes.push(daydate);
                        }
                        else if (c.Days[nowTime.getDate() - 1] == 4 && c.Weeks[DayOfWeek] == 1) {
                            let daydate = new Date(nowTime);
                            daydate.setDate(daydate.getDate() - 2);
                            datetimes.push(daydate);
                        }
                    }
                    else {
                        Weeks(c, arr[5], new Date(nowTime.getFullYear(), nowTime.getMonth() + 1, 0).getDate(), nowTime);
                        let DayOfWeek = ((nowTime.getDay()) + 6) % 7;
                        if (c.Days[nowTime.getDate() - 1] == 1 && c.Weeks[DayOfWeek] == 1) {
                            datetimes.push(new Date(nowTime));
                        }
                    }
                }
                if (datetimes.length >= num) {
                    break;
                }
                c.Init();
                nowTime.setSeconds(nowTime.getSeconds() + speed(arr, nowTime));
            }
            return datetimes;
        } catch (error) {
            console.log(error);
        }
    } $db.CronAnalytice = CronAnalytice;

    function speed(arr, now) {
        let addTime = 0;
        if (/^\d+$/.test(arr[1])) {
            if (now.getMinutes() < Number(arr[1])) {
                addTime += (Number(arr[1]) * 60) - (now.getMinutes() * 60) - now.getSeconds();
            }
            else if (now.getMinutes() > Number(arr[1])) {
                addTime += ((60 * 60) - (now.getMinutes() * 60)) + (Number(arr[1]) * 60) - now.getSeconds();
            }
            else {
                addTime += speedSecond(arr, now);
            }
        }
        else if (arr[1].indexOf(",") > -1) {
            let times = arr[1].split(",");
            if (now.getMinutes() < Number(times[0])) {
                addTime += (Number(times[0]) * 60) - (now.getMinutes() * 60) - now.getSeconds();
            }
            else if (now.getMinutes() >= Number(times[times.length - 1])) {
                addTime += ((60 * 60) - (now.getMinutes() * 60)) + (Number(times[0]) * 60) - now.getSeconds();
            }
            else if (times.indexOf(now.getMinutes() + "") > -1) {
                addTime += speedSecond(arr, now);
            }
            else {
                for (let t1 = 0; t1 < times.length; t1++) {
                    const t = Number(times[t1]);
                    if (now.getMinutes() < t) {
                        addTime += (t * 60) - (now.getMinutes() * 60) - now.getSeconds();
                        break;
                    }
                }
            }
        }
        else if (arr[1].indexOf("-") > -1) {
            let l = Number(arr[1].split("-")[0]),
                r = Number(arr[1].split("-")[1]);
            if (now.getMinutes() >= r) {
                addTime += ((60 * 60) - (now.getMinutes() * 60)) + (l * 60) - now.getSeconds();
            }
            else {
                addTime += speedSecond(arr, now);
            }
        }
        else if (arr[1].indexOf("/") > -1) {
            let l = Number(arr[0].split("/")[0]),
                r = Number(arr[0].split("/")[1]);
            if (now.getMinutes() >= l) {
                let pos = [];
                let t = now.getMinutes();
                while (true) {
                    if (t <= 59) {
                        pos.push(t);
                        t += r;
                    }
                    else { break; }
                }
                if (pos.indexOf(now.getMinutes()) > -1) {
                    addTime += speedSecond(arr, now);
                }
                else {
                    for (let t1 = 0; t1 < pos.length; t1++) {
                        const tt = pos[t1];
                        if (now.getMinutes() < tt) {
                            addTime += (tt * 60) - (now.getMinutes() * 60) - now.getSeconds();
                            break;
                        }
                    }
                }
            }
            else if (now.getMinutes() < l) {
                addTime += (l * 60) - (now.getMinutes() * 60) - now.getSeconds();
            }
        }

        if (addTime == 0) addTime = 1;
        return addTime;
    }

    function speedSecond(arr, now) {
        let addTime = 0;
        if (/^\d+$/.test(arr[0])) {
            if (now.getSeconds() < Number(arr[0])) {
                addTime += Number(arr[0]) - now.getSeconds();
            }
            else if (now.getSeconds() > Number(arr[0])) {
                addTime += (60 - now.getSeconds()) + Number(arr[0]);
            }
            else if (now.getSeconds() == Number(arr[0])) {
                addTime += 60;
            }
        }
        else if (arr[0].indexOf(",") > -1) {
            let times = arr[0].split(",");
            if (now.getSeconds() < Number(times[0])) {
                addTime += Number(times[0]) - now.getSeconds();
            }
            else if (now.getSeconds() >= Number(times[times.length - 1])) {
                addTime += (60 - now.getSeconds()) + Number(times[0]);
            }
            else if (times.indexOf(now.getSeconds() + "") > -1) {
                addTime += Number(times[Number(times.indexOf(now.getSeconds() + "")) + 1]) - now.getSeconds();
            }
            else {
                for (let t1 = 0; t1 < times.length; t1++) {
                    const t = Number(times[t1]);
                    if (now.getSeconds() < t) {
                        addTime += t - now.getSeconds();
                        break;
                    }
                }
            }
        }
        else if (arr[0].indexOf("-") > -1) {
            let l = Number(arr[0].split("-")[0]),
                r = Number(arr[0].split("-")[1]);
            if (now.getSeconds() >= r) {
                addTime += (60 - now.getSeconds()) + l;
            }
        }
        else if (arr[0].indexOf("/") > -1) {
            let l = Number(arr[0].split("/")[0]),
                r = Number(arr[0].split("/")[1]);
            if (now.getSeconds() >= l) {
                let i = now.getSeconds() + r;
                if (i <= 59) {
                    addTime += r;
                }
            }
            else if (now.getSeconds() < l) {
                addTime += l - now.getSeconds();
            }
        }

        if (addTime == 0) addTime = 1;
        return addTime;
    }

    function Seconds(c, str) {
        if (str == "*") {
            for (let i = 0; i < 60; i++) {
                c.Seconds[i] = 1;
            }
        }
        else if (str.indexOf("-") > -1) {
            let begin = Number(str.split("-")[0]);
            let end = Number(str.split("-")[1]);
            for (let i = begin; i <= end; i++) {
                c.Seconds[i] = 1;
            }
        }
        else if (str.indexOf("/") > -1) {
            let begin = Number(str.split("/")[0]);
            let interval = Number(str.split("/")[1]);
            while (true) {
                c.Seconds[begin] = 1;
                if ((begin + interval) >= 60)
                    break;
                begin += interval;
            }
        }
        else if (str.indexOf(",") > -1) {
            for (let i = 0; i < str.split(",").length; i++) {
                c.Seconds[Number(str.split(",")[i])] = 1;
            }
        }
        else {
            c.Seconds[Number(str)] = 1;
        }
    }

    function Minutes(c, str) {
        if (str == "*") {
            for (let i = 0; i < 60; i++) {
                c.Minutes[i] = 1;
            }
        }
        else if (str.indexOf("-") > -1) {
            let begin = Number(str.split("-")[0]);
            let end = Number(str.split("-")[1]);
            for (let i = begin; i <= end; i++) {
                c.Minutes[i] = 1;
            }
        }
        else if (str.indexOf("/") > -1) {
            let begin = Number(str.split("/")[0]);
            let interval = Number(str.split("/")[1]);
            while (true) {
                c.Minutes[begin] = 1;
                if ((begin + interval) >= 60)
                    break;
                begin += interval;
            }
        }
        else if (str.indexOf(",") > -1) {
            for (let i = 0; i < str.split(",").length; i++) {
                c.Minutes[Number(str.split(",")[i])] = 1;
            }
        }
        else {
            c.Minutes[Number(str)] = 1;
        }
    }

    function Hours(c, str) {
        if (str == "*") {
            for (let i = 0; i < 24; i++) {
                c.Hours[i] = 1;
            }
        }
        else if (str.indexOf("-") > -1) {
            let begin = Number(str.split("-")[0]);
            let end = Number(str.split("-")[1]);
            for (let i = begin; i <= end; i++) {
                c.Hours[i] = 1;
            }
        }
        else if (str.indexOf("/") > -1) {
            let begin = Number(str.split("/")[0]);
            let interval = Number(str.split("/")[1]);
            while (true) {
                c.Hours[begin] = 1;
                if ((begin + interval) >= 24)
                    break;
                begin += interval;
            }
        }
        else if (str.indexOf(",") > -1) {
            for (let i = 0; i < str.split(",").length; i++) {
                c.Hours[Number(str.split(",")[i])] = 1;
            }
        }
        else {
            c.Hours[Number(str)] = 1;
        }
    }

    function Month(c, str) {
        if (str == "*") {
            for (let i = 0; i < 12; i++) {
                c.Month[i] = 1;
            }
        }
        else if (str.indexOf("-") > -1) {
            let begin = Number(str.split("-")[0]);
            let end = Number(str.split("-")[1]);
            for (let i = begin; i <= end; i++) {
                c.Month[i - 1] = 1;
            }
        }
        else if (str.indexOf("/") > -1) {
            let begin = Number(str.split("/")[0]);
            let interval = Number(str.split("/")[1]);
            while (true) {
                c.Month[begin - 1] = 1;
                if ((begin + interval) >= 12)
                    break;
                begin += interval;
            }
        }
        else if (str.indexOf(",") > -1) {
            for (let i = 0; i < str.split(",").length; i++) {
                c.Month[Number(str.split(",")[i]) - 1] = 1;
            }
        }
        else {
            c.Month[Number(str) - 1] = 1;
        }
    }

    function Year(c, str) {
        if (str == null || str == "*") {
            for (let i = 0; i < 80; i++) {
                c.Year[i] = 1;
            }
        }
        else if (str.indexOf("-") > -1) {
            let begin = Number(str.split("-")[0]);
            let end = Number(str.split("-")[1]);
            for (let i = begin - 2019; i <= end - 2019; i++) {
                c.Year[i] = 1;
            }
        }
        else {
            c.Year[Number(str) - 2019] = 1;
        }
    }

    function Days(c, str, len, now) {
        for (let i = 0; i < 7; i++) {
            c.Weeks[i] = 1;
        }
        if (str == "*" || str == "?") {
            for (let i = 0; i < len; i++) {
                c.Days[i] = 1;
            }
        }
        else if (str.indexOf("-") > -1) {
            let begin = Number(str.split("-")[0]);
            let end = Number(str.split("-")[1]);
            for (let i = begin; i <= end; i++) {
                c.Days[i - 1] = 1;
            }
        }
        else if (str.indexOf("/") > -1) {
            let begin = Number(str.split("/")[0]);
            let interval = Number(str.split("/")[1]);
            while (true) {
                c.Days[begin - 1] = 1;
                if ((begin + interval) >= len)
                    break;
                begin += interval;
            }
        }
        else if (str.indexOf(",") > -1) {
            for (let i = 0; i < str.split(",").length; i++) {
                c.Days[Number(str.split(",")[i]) - 1] = 1;
            }
        }
        else if (str.indexOf("LW") > -1) {
            let i = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            let week = now.getDay();
            if (week == 0) {
                c.Days[i - 1] = 4;
            }
            else if (week == 6) {
                c.Days[i - 1] = 2;
            }
            else {
                c.Days[i - 1] = 1;
            }
        }
        else if (str.indexOf("L") > -1) {
            let i = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            c.Days[i - 1] = 1;
        }
        else if (str.indexOf("W") > -1) {
            let i = str.replace("W", "") == "" ? 0 : Number(str.replace("W", ""));
            if (now.getDate() == i) {
                let DayOfWeek = ((now.getDay()) + 6) % 7;
                if (DayOfWeek == 5) {
                    c.Days[i - 1] = 2;
                }
                else if (DayOfWeek == 6) {
                    c.Days[i - 1] = 3;
                } else {
                    c.Days[i - 1] = 1;
                }
            }
        }
        else {
            c.Days[Number(str) - 1] = 1;
        }
    }

    function Weeks(c, str, len, now) {
        if (str == "*" || str == "?") {
            for (let i = 0; i < 7; i++) {
                c.Weeks[i] = 1;
            }
        }
        else if (str.indexOf("-") > -1) {
            let begin = Number(str.split("-")[0]);
            let end = Number(str.split("-")[1]);
            for (let i = begin; i <= end; i++) {
                c.Weeks[i - 1] = 1;
            }
        }
        else if (str.indexOf(",") > -1) {
            for (let i = 0; i < str.split(",").length; i++) {
                c.Weeks[Number(str.split(",")[i]) - 1] = 1;
            }
        }
        else if (str.indexOf("L") > -1) {
            let i = str.replace("L", "") == "" ? 0 : Number(str.replace("L", ""));
            if (i == 0 || i == 1) {
                c.Weeks[6] = 1;
            }
            else {
                c.Weeks[i - 2] = 1;
            }
            c.Days[GetLastWeek(i, now) - 1] = 1;
            return;
        }
        else if (str.indexOf("#") > -1) {
            let i = Number(str.split("#")[0]);
            let j = Number(str.split("#")[1]);
            if (i == 1) {
                c.Weeks[6] = 1;
            }
            else {
                c.Weeks[i - 2] = 1;
            }
            c.Days[GetWeek(i - 2, j, now)] = 1;
            return;
        }
        else {
            c.Weeks[Number(str) - 1] = 1;
        }
        for (let i = 0; i < len; i++) {
            c.Days[i] = 1;
        }
    }

    function GetLastWeek(i, now) {
        let d = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        let last = d.getDate();
        let week = d.getDay();
        let mapping = [7, 1, 2, 3, 4, 5, 6];

        if (mapping[week] == mapping[i - 1]) {
            return d.getDate();
        }
        else if (mapping[week] > mapping[i - 1]) {
            d.setDate(d.getDate() - (mapping[week] - mapping[i - 1]));
            return d.getDate();
        }
        else if (mapping[week] < mapping[i - 1]) {
            d.setDate(d.getDate() - (7 - (mapping[i - 1] - mapping[week])));
            return d.getDate();
        }
    }

    function GetWeek(i, j, now) {
        let day = 0;
        let d = new Date(now.getFullYear(), now.getMonth(), 1);
        let DayOfWeek = (((d.getDay()) + 6) % 7) + 1;
        if (i >= DayOfWeek) {
            day = (7 - DayOfWeek + 1) + 7 * (j - 2) + i;
        }
        else {
            day = (7 - DayOfWeek + 1) + 7 * (j - 1) + i;
        }
        return day;
    }
}(window.$db))