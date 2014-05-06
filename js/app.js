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
    playerArmLength = 20,
    playerArmSeparationAngle = 45,
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

    var player = createPlayer(paper, drawingGrid, adjustedPaperWidth, paperHeight);

    drawingGrid.mousemove(grab);

    var scrollerBaseline = paperHeight - 50;
    // First, draw the baseline
    paper.path("M0 "+ scrollerBaseline+"L"+adjustedPaperWidth+" "+scrollerBaseline);

    var enemies = [];

    var defaultEnemySquareWidth = "30";
//    for(var x = 1; x <= 10; x++) {
//        (function(x) {
//            window.setTimeout(function () {
//                if (x % 2 == 0) {
//                    createEnemySquare(paper, {"width": defaultEnemySquareWidth, "verticalBaseline": scrollerBaseline, "horizontalBoundary": { "right": adjustedPaperWidth, "left": (-2 * defaultEnemySquareWidth)}});
//                } else {
//                    createEnemyCircle(paper, {"radius": "15", "verticalBaseline": scrollerBaseline, "horizontalBoundary": { "right": adjustedPaperWidth, "left": (-2 * defaultEnemySquareWidth)}});
//                }
//            }, 3000 * x);
//        })(x);
//    }

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
    (function(centerX, centerY) {
        playerGrid.mousemove(function(evt) {
            var grabTargetX = (evt.clientX - paperWidthOffset) - centerX,
                grabTargetY = (paperHeightOffset + evt.clientY) - centerY,
                grabTargetAngle = Math.atan2(grabTargetY, grabTargetX);
            ;
//            console.log("eventX: " + evt.clientX + " eventY: " + evt.clientY + " tx: " + paperWidthOffset + " ty: " + paperHeightOffset + " centerX: " + centerX + " centerY: " + centerY);
            playerLeftArm.transform("r"+radians2degrees(grabTargetAngle)+","+centerX+","+centerY);
            playerRightArm.transform("r"+(radians2degrees(grabTargetAngle - Math.PI) - playerArmSeparationAngle)+","+centerX+","+centerY);
        });
    })(playerStartX, playerArmStartY);

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