var Clock = {
    element: null,

    ljust: function (value) {
        if (value < 10) return "0" + value;
        else return value;
    },

    update: function () {
        let date = new Date();
        let meridian = date.getHours() >= 12 ? "PM" : "AM";
        let clock =
            this.ljust(((date.getHours() + 11) % 12) + 1) +
            ":" +
            this.ljust(date.getMinutes()) +
            " " +
            meridian;
        this.element.html(clock);

        let $this = this;
        setTimeout(function () {
            $this.update();
        }, 60 * 1000);
    },

    init: function (elem) {
        this.element = $(elem);

        let $this = this;
        $this.update();
        setTimeout(function () {
            $this.update();
        }, (60 - new Date().getUTCSeconds()) * 1000);
    },
};

var Calendar = {
    dates: null,
    month: null,
    displayDate: null,
    selDate: null,

    update: function () {
        this.dates.html("");

        let days = Array.from({ length: 35 }, () => "  ");
        let firstDay = new Date(
            this.displayDate.getFullYear(),
            this.displayDate.getMonth(),
            1
        );
        let lastDay = new Date(
            this.displayDate.getFullYear(),
            this.displayDate.getMonth() + 1,
            0
        );

        for (let day = 1; day <= lastDay.getDate(); day++) {
            days[firstDay.getDay() + day - 1] = day;
        }

        for (let i = 0; i < days.length; i++) {
            let date = "<a>";
            date += days[i].toString().padStart(2, " ");
            date += "</a>";
            date = $(date).attr("day", days[i]);
            if (this.displayDate.getMonth() == new Date().getMonth())
                if (days[i] == new Date().getDate()) date.addClass("today");
            if (
                this.displayDate.getMonth() == this.selDate.getMonth() &&
                this.displayDate.getDate() == days[i]
            )
                date.addClass("selected");
            this.dates.append(date);
            if (i % 7 != 6) this.dates.append(" ");
            else this.dates.append("\n");
        }

        let month = new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
        }).format(this.displayDate);
        month = month
            .padStart(month.length + Math.floor((14 - month.length) / 2), " ")
            .padEnd(14, " ");

        this.month.html(month);
        this.month.attr("monthIndex", this.monthIndex);
    },

    init: function (dates, month) {
        this.dates = $(dates);
        this.month = $(month);
        this.prevMonth = $("#calendar a.prev_month");
        this.nextMonth = $("#calendar a.next_month");
        this.selDate = new Date();
        this.displayDate = new Date();
        this.update();

        $("#calendar .dates").on("click", "a", (event) => {
            let t = $(event.currentTarget);
            let c = $("#calendar .dates");

            if (t.is($("a.selected"), c)) {
                if (!t.is($("a.today", c))) {
                    $("a.selected", c).removeClass("selected");
                    $("a.today", c).addClass("selected");
                }
            } else {
                $("a.selected", c).removeClass("selected");
                t.addClass("selected");
            }

            this.selDate.setDate($("a.selected", c).text());
            console.log(this.selDate);
        });

        this.prevMonth.on("click", (event) => {
            this.displayDate.setMonth(this.displayDate.getMonth() - 1);
            this.update();
        });

        this.nextMonth.on("click", (event) => {
            this.displayDate.setMonth(this.displayDate.getMonth() + 1);
            this.update();
        });
    },
};

var Log = {};

$(function () {
    Clock.init("#calendar .clock");
    Calendar.init("#calendar .dates", "#calendar .month");
});
