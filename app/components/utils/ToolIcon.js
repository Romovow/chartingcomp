import React from 'react';



import LineTool5PointsPattern from '../icons/LineTool5PointsPattern.svg';
import LineToolABCD from '../icons/LineToolABCD.svg';
import LineToolArc from '../icons/LineToolArc.svg';
import LineToolArrow from '../icons/LineToolArrow.svg';
import LineToolArrowMarker from '../icons/LineToolArrowMarker.svg';
import LineToolArrowMarkDown from '../icons/LineToolArrowMarkDown.svg';
import LineToolArrowMarkLeft from '../icons/LineToolArrowMarkLeft.svg';
import LineToolArrowMarkRight from '../icons/LineToolArrowMarkRight.svg';
import LineToolArrowMarkUp from '../icons/LineToolArrowMarkUp.svg';
import LineToolBalloon from '../icons/LineToolBalloon.svg';
import LineToolComment from '../icons/LineToolComment.svg';
import LineToolBarsPattern from '../icons/LineToolBarsPattern.svg';
import LineToolBezierCubic from '../icons/LineToolBezierCubic.svg';
import LineToolBezierQuadro from '../icons/LineToolBezierQuadro.svg';
import LineToolBrush from '../icons/LineToolBrush.svg';
import LineToolCallout from '../icons/LineToolCallout.svg';
import LineToolCircle from '../icons/LineToolCircle.svg';
import LineToolCircleLines from '../icons/LineToolCircleLines.svg';
import LineToolCypherPattern from '../icons/LineToolCypherPattern.svg';
import LineToolDateAndPriceRange from '../icons/LineToolDateAndPriceRange.svg';
import LineToolDateRange from '../icons/LineToolDateRange.svg';
import LineToolDisjointAngle from '../icons/LineToolDisjointAngle.svg';
import LineToolElliottCorrection from '../icons/LineToolElliottCorrection.svg';
import LineToolElliottDoubleCombo from '../icons/LineToolElliottDoubleCombo.svg';
import LineToolElliottImpulse from '../icons/LineToolElliottImpulse.svg';
import LineToolElliottTriangle from '../icons/LineToolElliottTriangle.svg';
import LineToolElliottTripleCombo from '../icons/LineToolElliottTripleCombo.svg';
import LineToolEllipse from '../icons/LineToolEllipse.svg';
import LineToolExtended from '../icons/LineToolExtended.svg';
import LineToolFibChannel from '../icons/LineToolFibChannel.svg';
import LineToolFibCircles from '../icons/LineToolFibCircles.svg';
import LineToolFibRetracement from '../icons/LineToolFibRetracement.svg';
import LineToolFibSpeedResistanceArcs from '../icons/LineToolFibSpeedResistanceArcs.svg';
import LineToolFibSpeedResistanceFan from '../icons/LineToolFibSpeedResistanceFan.svg';
import LineToolFibSpiral from '../icons/LineToolFibSpiral.svg';
import LineToolFibTimeZone from '../icons/LineToolFibTimeZone.svg';
import LineToolFibWedge from '../icons/LineToolFibWedge.svg';
import LineToolFlagMark from '../icons/LineToolFlagMark.svg';
import LineToolFlatBottom from '../icons/LineToolFlatBottom.svg';
import LineToolAnchoredVWAP from '../icons/LineToolAnchoredVWAP.svg';
import LineToolGannComplex from '../icons/LineToolGannComplex.svg';
import LineToolGannFixed from '../icons/LineToolGannFixed.svg';
import LineToolGannFan from '../icons/LineToolGannFan.svg';
import LineToolGannSquare from '../icons/LineToolGannSquare.svg';
import LineToolGhostFeed from '../icons/LineToolGhostFeed.svg';
import LineToolHeadAndShoulders from '../icons/LineToolHeadAndShoulders.svg';
import LineToolHorzLine from '../icons/LineToolHorzLine.svg';
import LineToolHorzRay from '../icons/LineToolHorzRay.svg';
import LineToolInsidePitchfork from '../icons/LineToolInsidePitchfork.svg';
import LineToolNote from '../icons/LineToolNote.svg';
import LineToolNoteAbsolute from '../icons/LineToolNoteAbsolute.svg';
import LineToolSignpost from '../icons/LineToolSignpost.svg';
import LineToolParallelChannel from '../icons/LineToolParallelChannel.svg';
import LineToolPitchfan from '../icons/LineToolPitchfan.svg';
import LineToolPitchfork from '../icons/LineToolPitchfork.svg';
import LineToolPolyline from '../icons/LineToolPolyline.svg';
import LineToolPath from '../icons/LineToolPath.svg';
import LineToolPrediction from '../icons/LineToolPrediction.svg';
import LineToolPriceLabel from '../icons/LineToolPriceLabel.svg';
import LineToolPriceNote from '../icons/LineToolPriceNote.svg';
import LineToolPriceRange from '../icons/LineToolPriceRange.svg';
import LineToolProjection from '../icons/LineToolProjection.svg';
import LineToolRay from '../icons/LineToolRay.svg';
import LineToolRectangle from '../icons/LineToolRectangle.svg';
import LineToolRegressionTrend from '../icons/LineToolRegressionTrend.svg';
import LineToolRiskRewardLong from '../icons/LineToolRiskRewardLong.svg';
import LineToolRiskRewardShort from '../icons/LineToolRiskRewardShort.svg';
import LineToolFixedRangeVolumeProfile from '../icons/LineToolFixedRangeVolumeProfile.svg';
import LineToolRotatedRectangle from '../icons/LineToolRotatedRectangle.svg';
import LineToolSchiffPitchfork from '../icons/LineToolSchiffPitchfork.svg';
import LineToolSchiffPitchfork2 from '../icons/LineToolSchiffPitchfork2.svg';
import LineToolSineLine from '../icons/LineToolSineLine.svg';
import LineToolText from '../icons/LineToolText.svg';
import LineToolTextAbsolute from '../icons/LineToolTextAbsolute.svg';
import LineToolThreeDrivers from '../icons/LineToolThreeDrivers.svg';
import LineToolTimeCycles from '../icons/LineToolTimeCycles.svg';
import LineToolTrendAngle from '../icons/LineToolTrendAngle.svg';
import LineToolTrendBasedFibExtension from '../icons/LineToolTrendBasedFibExtension.svg';
import LineToolTrendBasedFibTime from '../icons/LineToolTrendBasedFibTime.svg';
import LineToolTrendLine from '../icons/LineToolTrendLine.svg';
import LineToolInfoLine from '../icons/LineToolInfoLine.svg';
import LineToolTriangle from '../icons/LineToolTriangle.svg';
import LineToolTrianglePattern from '../icons/LineToolTrianglePattern.svg';
import LineToolVertLine from '../icons/LineToolVertLine.svg';
import LineToolCrossLine from '../icons/LineToolCrossLine.svg';
import LineToolHighlighter from '../icons/LineToolHighlighter.svg';

const ToolIcon = ({ toolName }) => {
    console.log("Tool Name:", toolName); // Debug: Check the tool name received
  
    const icons = {
      'LineTool5PointsPattern': LineTool5PointsPattern,
      'LineToolABCD': LineToolABCD,
      'LineToolArc': LineToolArc,
      'LineToolArrow': LineToolArrow,
       'LineToolArrowMarker': LineToolArrowMarker,
      'LineToolArrowMarkDown': LineToolArrowMarkDown,
      'LineToolArrowMarkLeft': LineToolArrowMarkLeft,
      'LineToolArrowMarkRight': LineToolArrowMarkRight,
      'LineToolArrowMarkUp': LineToolArrowMarkUp,
       'LineToolBalloon': LineToolBalloon,
      'LineToolComment': LineToolComment,
      'LineToolBarsPattern': LineToolBarsPattern,
      'LineToolBezierCubic': LineToolBezierCubic,
      'LineToolBezierQuadro': LineToolBezierQuadro,
      'LineToolBrush': LineToolBrush,
      'LineToolCallout': LineToolCallout,
      'LineToolCircle': LineToolCircle,
      'LineToolCircleLines': LineToolCircleLines,
      'LineToolCypherPattern': LineToolCypherPattern,
      'LineToolDateAndPriceRange': LineToolDateAndPriceRange,
      'LineToolDateRange': LineToolDateRange,
          'LineToolDisjointAngle': LineToolDisjointAngle,
      'LineToolElliottCorrection': LineToolElliottCorrection,
      'LineToolElliottDoubleCombo': LineToolElliottDoubleCombo,
      'LineToolElliottImpulse': LineToolElliottImpulse,
      'LineToolElliottTriangle': LineToolElliottTriangle,
      'LineToolElliottTripleCombo': LineToolElliottTripleCombo,
      'LineToolEllipse': LineToolEllipse,
      'LineToolExtended': LineToolExtended,
      'LineToolFibChannel': LineToolFibChannel,
      'LineToolFibCircles': LineToolFibCircles,
      'LineToolFibRetracement': LineToolFibRetracement,
        'LineToolFibSpeedResistanceArcs': LineToolFibSpeedResistanceArcs,
        'LineToolFibSpeedResistanceFan': LineToolFibSpeedResistanceFan,
        'LineToolFibSpiral': LineToolFibSpiral,
        'LineToolFibTimeZone': LineToolFibTimeZone,
        'LineToolFibWedge': LineToolFibWedge,
        'LineToolFlagMark': LineToolFlagMark,
        'LineToolFlatBottom': LineToolFlatBottom,
        'LineToolAnchoredVWAP': LineToolAnchoredVWAP,
        'LineToolGannComplex': LineToolGannComplex,
        'LineToolGannFixed': LineToolGannFixed,
        'LineToolGannFan': LineToolGannFan,
        'LineToolGannSquare': LineToolGannSquare,
        'LineToolGhostFeed': LineToolGhostFeed,
        'LineToolHeadAndShoulders': LineToolHeadAndShoulders,
    'LineToolHorzLine': LineToolHorzLine,
        'LineToolHorzRay': LineToolHorzRay,
        'LineToolInsidePitchfork': LineToolInsidePitchfork,
        'LineToolNote': LineToolNote,
        'LineToolNoteAbsolute': LineToolNoteAbsolute,
        'LineToolSignpost': LineToolSignpost,
        'LineToolParallelChannel': LineToolParallelChannel,
        'LineToolPitchfan': LineToolPitchfan,
        'LineToolPitchfork': LineToolPitchfork,
        'LineToolPolyline': LineToolPolyline,
    'LineToolPath': LineToolPath,
        'LineToolPrediction': LineToolPrediction,
        'LineToolPriceLabel': LineToolPriceLabel,
        'LineToolPriceNote': LineToolPriceNote,
        'LineToolPriceRange': LineToolPriceRange,
        'LineToolProjection': LineToolProjection,
        'LineToolRay': LineToolRay,
        'LineToolRectangle': LineToolRectangle,
        'LineToolRegressionTrend': LineToolRegressionTrend,
        'LineToolRiskRewardLong': LineToolRiskRewardLong,
        'LineToolRiskRewardShort': LineToolRiskRewardShort,
        'LineToolFixedRangeVolumeProfile': LineToolFixedRangeVolumeProfile,
        'LineToolRotatedRectangle': LineToolRotatedRectangle,
        'LineToolSchiffPitchfork': LineToolSchiffPitchfork,
        'LineToolSchiffPitchfork2': LineToolSchiffPitchfork2,
        'LineToolSineLine': LineToolSineLine,
        'LineToolText': LineToolText,
        'LineToolTextAbsolute': LineToolTextAbsolute,
        'LineToolThreeDrivers': LineToolThreeDrivers,
        'LineToolTimeCycles': LineToolTimeCycles,
        'LineToolTrendAngle': LineToolTrendAngle,
        'LineToolTrendBasedFibExtension': LineToolTrendBasedFibExtension,
        'LineToolTrendBasedFibTime': LineToolTrendBasedFibTime,
        'LineToolTrendLine': LineToolTrendLine,
        'LineToolInfoLine': LineToolInfoLine,
        'LineToolTriangle': LineToolTriangle,
        'LineToolTrianglePattern': LineToolTrianglePattern,
        'LineToolVertLine': LineToolVertLine,
        'LineToolCrossLine': LineToolCrossLine,
        'LineToolHighlighter': LineToolHighlighter
    };

    const IconComponent = icons[toolName];
    if (!IconComponent) {
        return <p>Icon not found</p>;
    }

    return <IconComponent />;
};

export default ToolIcon;