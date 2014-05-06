/**
 * Created by kwhite on 5/5/2014.
 */
var scroller,
    paperWidth,
    paperHeight,
    scrollerPaddingLeft,
    scrollerPaddingRight,
    paperWidthOffset,
    paperHeightOffset
;

var playerHeadRadius = 20,
    playerBodyLength = 30,
    playerArmLength = 30,
    playerArmSeparationAngle = 60,
    playerLegLength = 20,
    playerStartX,
    playerArmStartY,
    playerArmJoint
;

function createScrollerWindow() {
    scroller = $('.scroller-canvas'),
    paperWidth = parseInt(scroller.css('width')),
    paperHeight = parseInt(scroller.css('height')),
    scrollerPaddingLeft = parseInt(scroller.css('padding-left')),
    scrollerPaddingRight = parseInt(scroller.css('padding-right')),
    paperHeightOffset = parseInt(scroller.offset().top),
    paperWidthOffset = parseInt(scroller.offset().left)
    ;

    var adjustedPaperWidth = paperWidth - (scrollerPaddingLeft + scrollerPaddingRight);
    var paper = Raphael(scroller.get(0), adjustedPaperWidth, paperHeight);
    var drawingGrid = paper.rect(0, 0, adjustedPaperWidth, paperHeight, 5);
    drawingGrid.attr({fill: "#fff", stroke: "#000"});


    var scrollerBaseline = paperHeight/2 + playerBodyLength + playerHeadRadius*2;
    // First, draw the baseline
    paper.path("M0 "+ scrollerBaseline+"L"+adjustedPaperWidth+" "+scrollerBaseline);
    var player = createPlayer(paper, drawingGrid, adjustedPaperWidth, paperHeight);

    drawingGrid.mousemove(grab);

    var enemies = [];

    var defaultEnemySquareWidth = "30";
    createEnemyCircle(paper, {"radius": "15", "verticalBaseline": scrollerBaseline, "horizontalBoundary": { "right": adjustedPaperWidth, "left": (-2 * defaultEnemySquareWidth)}});
    for(var x = 1; x <= 20; x++) {
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

/**
 * Draw the player
 * @param Raphael.Element paper
 * @param array-like object containing the player Raphael Elements
 */
function createPlayer(paper, playerGrid, paperWidth, paperHeight) {
    playerStartX = (paperWidth / 2),
    playerArmStartY = ((paperHeight / 2) + playerHeadRadius + (playerBodyLength / 2)),
    playerArmJoint = "M" + playerStartX + " " + playerArmStartY;
    var player = paper.set();
    var playerHead = paper.circle(playerStartX, paperHeight/2, playerHeadRadius),
        playerBody = paper.path("M"+playerStartX+" "+((paperHeight/2)+playerHeadRadius)+"L"+playerStartX+" "+((paperHeight/2)+playerHeadRadius+playerBodyLength)),
        playerLeftArm = paper.path(playerArmJoint+"L"+(playerStartX+playerArmLength)+" "+playerArmStartY),
        playerRightArm = paper.path(playerArmJoint+"L"+(playerStartX-playerArmLength)+" "+playerArmStartY),
        playerLeftLeg = paper.path("M"+playerStartX+" "+((paperHeight/2)+playerHeadRadius+(playerBodyLength))+"L"+(playerStartX+playerLegLength)+" "+((paperHeight/2)+playerHeadRadius+playerBodyLength+playerLegLength)),
        playerRightLeg = paper.path("M"+playerStartX+" "+((paperHeight/2)+playerHeadRadius+(playerBodyLength))+"L"+(playerStartX-playerLegLength)+" "+((paperHeight/2)+playerHeadRadius+playerBodyLength+playerLegLength))
        ;
    playerHead.attr({"stroke-width": "2"});
    playerBody.attr({"stroke-width": "3"});
    playerLeftArm.attr({"stroke-width": "2"});
    playerRightArm.attr({"stroke-width": "2"});

    playerLeftLeg.attr({"stroke-width": "2"});
    playerRightLeg.attr({"stroke-width": "2"});
    player.push(
        playerHead,
        playerBody,
        playerLeftArm,
        playerRightArm,
        playerLeftLeg,
        playerRightLeg
    );

    (function(centerX, centerY) {
        var inClick = false;
        playerGrid.mousemove(function(evt) {
            var rotationAngleRadians = Math.PI; //PI == 1 radian
            if ((evt.clientX - paperWidthOffset) < centerX) {
                rotationAngleRadians =  (-1 * Math.PI) - Math.PI;
            }

            if (!inClick) {
                playerLeftArm.transform("r" + (radians2degrees(rotationAngleRadians + Math.PI / 2) + playerArmSeparationAngle) + "," + centerX + "," + centerY);
                playerRightArm.transform("r" + (radians2degrees(rotationAngleRadians + Math.PI / 2) - playerArmSeparationAngle) + "," + centerX + "," + centerY);
            }
            console.log("fart");
        });

        var kaiblast;
        playerGrid.dblclick(function(evt) {
            var kaiblastRadius = playerHeadRadius * 1.5;
            kaiblast = paper.circle(playerStartX+50, playerArmStartY, kaiblastRadius);
            kaiblast.attr({"fill": "#b6c6f9", "stroke-width": "2"});
            kaiblast.animate({"fill": "#22f"}, 250);
            window.setTimeout(function() {
               kaiblast.animate({cx: paperWidth+kaiblastRadius, "fill": "#b6c6f9"}, 2000)
            }, 500);
        });

        /** Got some work to do on jumping
         *
        playerGrid.click(function(evt) {
            if (!inDblClick) {

            inClick = true;
            console.log("dookie");
            player.transform("t0,-100...");
            window.setTimeout(function() {
                player.transform("t0,0"+player.transform());
                inClick = false;
            }, 200);
            }
        });
         */
    })(playerStartX, playerArmStartY);
    return player;
}

/**
 * handle mouse event for player 'grab'
 * @param evt
 */
function grab(evt) {
}

function kick(evt) {
}

function radians2degrees(radians) {
    return radians * 180 / Math.PI;
}