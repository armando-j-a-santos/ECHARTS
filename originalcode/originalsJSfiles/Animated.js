"use strict";
(self.webpackChunk_am5 = self.webpackChunk_am5 || []).push([
    [4837], {
        9295: function(t, e, i) {
            i.r(e), i.d(e, {
                am5themes_Animated: function() {
                    return r
                }
            });
            var n = i(5125),
                a = function(t) {
                    function e() {
                        return null !== t && t.apply(this, arguments) || this
                    }
                    return (0, n.ZT)(e, t), Object.defineProperty(e.prototype, "setupDefaultRules", {
                        enumerable: !1,
                        configurable: !0,
                        writable: !0,
                        value: function() {
                            t.prototype.setupDefaultRules.call(this), this.rule("Component").setAll({
                                interpolationDuration: 600
                            }), this.rule("Hierarchy").set("animationDuration", 600), this.rule("Scrollbar").set("animationDuration", 600), this.rule("Tooltip").set("animationDuration", 300), this.rule("MapChart").set("animationDuration", 1e3), this.rule("MapChart").set("wheelDuration", 300), this.rule("Entity").setAll({
                                stateAnimationDuration: 600
                            }), this.rule("Sprite").states.create("default", {
                                stateAnimationDuration: 600
                            }), this.rule("Tooltip", ["axis"]).setAll({
                                animationDuration: 200
                            }), this.rule("WordCloud").set("animationDuration", 500)
                        }
                    }), e
                }(i(3409).Q);
            const r = a
        }
    },
    function(t) {
        var e = (9295, t(t.s = 9295)),
            i = window;
        for (var n in e) i[n] = e[n];
        e.__esModule && Object.defineProperty(i, "__esModule", {
            value: !0
        })
    }
]);
