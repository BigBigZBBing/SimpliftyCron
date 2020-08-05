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
                if (c.Seconds[nowTime.getSeconds()] == 1 && c.Minutes[nowTime.getMinutes()] == 1 && c.Hours[nowTime.getHours()] == 1 && c.Month[nowTime.getMonth()] == 1 && c.Year[nowTime.getFullYear() - 2019] == 1) {
                    if (arr[3] != "?") {
                        Days(c, arr[3], new Date(nowTime.getFullYear(), nowTime.getMonth(), 0).getDate(), nowTime);
                        let DayOfWeek = ((nowTime.getDay()) + 6) % 7;
                        if (c.Days[nowTime.getDate() - 1] == 1 && c.Weeks[DayOfWeek] == 1) {
                            datetimes.push(new Date(nowTime));
                        }
                    }
                    else {
                        Weeks(c, arr[5], new Date(nowTime.getFullYear(), nowTime.getMonth(), 0).getDate(), nowTime);
                        let DayOfWeek = ((nowTime.getDay()) + 6) % 7;
                        if (c.Days[nowTime.getDate() - 1] == 1 && c.Weeks[DayOfWeek] == 1) {
                            let weekdate = new Date(nowTime);
                            weekdate.setDate(weekdate.getDate() - 1);
                            datetimes.push(weekdate);
                        }
                    }
                }
                if (datetimes.length >= num) {
                    break;
                }
                c.Init();
                if (arr[1].indexOf("-") == -1 && arr[1].indexOf(",") == -1 && arr[1].indexOf("*") == -1 && arr[1].indexOf("/") == -1) {
                    if (nowTime.getMinutes() == Number(arr[1])) {
                        addtime = 3600;
                    }
                }
                else if (arr[0] == "0" && nowTime.getSeconds() == 0) {
                    addtime = 60;
                }
                nowTime.setSeconds(nowTime.getSeconds() + addtime);
            }
            return datetimes;
        } catch (error) {

        }
    } $db.CronAnalytice = CronAnalytice;

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
        else if (str.indexOf("L") > -1) {
            let i = str.Replace("L", "") == "" ? 0 : Number(str.Replace("L", ""));
            c.Days[len - 1 - i] = 1;
        }
        else if (str.indexOf("W") > -1) {
            c.Days[len - 1] = 1;
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
            let i = str.Replace("L", "") == "" ? 0 : Number(str.Replace("L", ""));
            if (i == 0) {
                c.Weeks[6] = 1;
            }
            else {
                c.Weeks[i - 1] = 1;
                c.Days[GetLastWeek(i, now) - 1] = 1;
                return;
            }
        }
        else if (str.indexOf("#") > -1) {
            let i = Number(str.split("#")[0]);
            let j = Number(str.split("#")[1]);
            c.Weeks[i - 1] = 1;
            c.Days[GetWeek(i - 1, j, now)] = 1;
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
        let d = new Date(now);
        now.setDate(now.getDate() + (1 - now.getDate()));
        d.setMonth(d.getMonth() + 1);
        d.setSeconds(d.getSeconds() - 1);
        let DayOfWeek = (((d.getDay()) + 6) % 7) + 1;
        let a = DayOfWeek >= i ? DayOfWeek - i : 7 + DayOfWeek - i;
        return new Date(now.getFullYear(), now.getMonth(), 0).getDate() - a;
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