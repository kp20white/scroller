/**
 * Created by kwhite on 5/5/2014.
 */
function createScrollerWindow() {
    var scroller = $('.scroller-canvas');
    var paperWidth = parseInt(scroller.css('width'));
    var paperHeight = parseInt(scroller.css('height'));
    var scrollerPaddingLeft = parseInt(scroller.css('padding-left'));
    var scrollerPaddingRight = parseInt(scroller.css('padding-right'));
    var paperOffset = scroller.offset();
    var adjustedPaperWidth = paperWidth - (scrollerPaddingLeft + scrollerPaddingRight);
    var paper = Raphael(scroller.get(0), adjustedPaperWidth, paperHeight);
    var drawingGrid = paper.rect(0, 0, adjustedPaperWidth, paperHeight, 5);
    drawingGrid.attr({fill: "#fff", stroke: "#000"});

    var scrollerBaseline = paperHeight - 50;
    // First, draw the baseline
    paper.path("M0 "+ scrollerBaseline+"L"+adjustedPaperWidth+" "+scrollerBaseline);

    var enemies = [];

    var defaultEnemySquareWidth = "30";
    for(var x = 1; x <= 10; x++) {
        (function(x) {
            window.setTimeout(function () {
                if (x % 2 == 0) {
                    createEnemySquare(paper, {"width": defaultEnemySquareWidth, "verticalBaseline": scrollerBaseline, "horizontalBoundary": { "right": adjustedPaperWidth, "left": (-2 * defaultEnemySquareWidth)}});
                } else {
                    createEnemyCircle(paper, {"radius": "15", "verticalBaseline": scrollerBaseline, "horizontalBoundary": { "right": adjustedPaperWidth, "left": (-2 * defaultEnemySquareWidth)}});
                }
            }, 3000 * x);
        })(x);
    }

}

function createEnemySquare(paper, enemyDimensions) {
    var enemySquareHeight = enemySquareWidth = parseInt(enemyDimensions.width);
    var enemySquare = paper.rect(enemyDimensions.horizontalBoundary.right+enemySquareWidth, enemyDimensions.verticalBaseline - (enemySquareHeight+2), enemySquareWidth, enemySquareHeight);
    enemySquare.attr({"stroke-width": "3"});
    enemySquare.animate({x: enemyDimensions.horizontalBoundary.left}, 5000);
}

function createEnemyCircle(paper, enemyDimensions) {
    var enemyCircleRadius = parseInt(enemyDimensions.radius),
        enemyCircleDiameter = enemyCircleRadius*2;
    var enemyCircle = paper.circle(enemyDimensions.horizontalBoundary.right+enemyCircleDiameter, enemyDimensions.verticalBaseline - (enemyCircleRadius), enemyCircleRadius)
    enemyCircle.attr({"stroke-width": "3"});
    enemyCircle.animate({cx: enemyDimensions.horizontalBoundary.left}, 5000);
}