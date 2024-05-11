// src/config/toolsConfig.js
import ToolIcon from '../utils/ToolIcon'; 

export const groupIcons = {
    'Trend Lines': <ToolIcon toolName="Test" />,
    'Shapes': <ToolIcon toolName="LineToolRectangle" />,
    'Patterns': <ToolIcon toolName="LineToolHeadAndShoulders" />,
    'Fibonacci': <ToolIcon toolName="LineToolFibRetracement" />,
    'Gann Tools': <ToolIcon toolName="LineToolGannFan" />,
    'Annotations': <ToolIcon toolName="LineToolText" />,
    'Miscellaneous': <ToolIcon toolName="LineToolBrush" />,
    'Measurement and Projections': <ToolIcon toolName="LineToolPriceLabel" />,
    'Elliott Wave': <ToolIcon toolName="LineToolElliottImpulse" />,
};

export const tools = [
    'LineTool5PointsPattern',
    'LineToolABCD',
    'LineToolArc',
    'LineToolArrow',
    'LineToolArrowMarker',
    'LineToolArrowMarkDown',
    'LineToolArrowMarkLeft',
    'LineToolArrowMarkRight',
    'LineToolArrowMarkUp',
    'LineToolBalloon',
    'LineToolComment',
    'LineToolBarsPattern',
    'LineToolBezierCubic',
    'LineToolBezierQuadro',
    'LineToolBrush',
    'LineToolCallout',
    'LineToolCircle',
    'LineToolCircleLines',
    'LineToolCypherPattern',
    'LineToolDateAndPriceRange',
    'LineToolDateRange',
    'LineToolDisjointAngle',
    'LineToolElliottCorrection',
    'LineToolElliottDoubleCombo',
    'LineToolElliottImpulse',
    'LineToolElliottTriangle',
    'LineToolElliottTripleCombo',
    'LineToolEllipse',
    'LineToolExtended',
    'LineToolFibChannel',
    'LineToolFibCircles',
    'LineToolFibRetracement',
    'LineToolFibSpeedResistanceArcs',
    'LineToolFibSpeedResistanceFan',
    'LineToolFibSpiral',
    'LineToolFibTimeZone',
    'LineToolFibWedge',
    'LineToolFlagMark',
    'LineToolFlatBottom',
    'LineToolAnchoredVWAP',
    'LineToolGannComplex',
    'LineToolGannFixed',
    'LineToolGannFan',
    'LineToolGannSquare',
    'LineToolGhostFeed',
    'LineToolHeadAndShoulders',
    'LineToolHorzLine',
    'LineToolHorzRay',
    'LineToolInsidePitchfork',
    'LineToolNote',
    'LineToolNoteAbsolute',
    'LineToolSignpost',
    'LineToolParallelChannel',
    'LineToolPitchfan',
    'LineToolPitchfork',
    'LineToolPolyline',
    'LineToolPath',
    'LineToolPrediction',
    'LineToolPriceLabel',
    'LineToolPriceNote',
    'LineToolPriceRange',
    'LineToolProjection',
    'LineToolRay',
    'LineToolRectangle',
    'LineToolRegressionTrend',
    'LineToolRiskRewardLong',
    'LineToolRiskRewardShort',
    'LineToolFixedRangeVolumeProfile',
    'LineToolRotatedRectangle',
    'LineToolSchiffPitchfork',
    'LineToolSchiffPitchfork2',
    'LineToolSineLine',
    'LineToolText',
    'LineToolTextAbsolute',
    'LineToolThreeDrivers',
    'LineToolTimeCycles',
    'LineToolTrendAngle',
    'LineToolTrendBasedFibExtension',
    'LineToolTrendBasedFibTime',
    'LineToolTrendLine',
    'LineToolInfoLine',
    'LineToolTriangle',
    'LineToolTrianglePattern',
    'LineToolVertLine',
    'LineToolCrossLine',
    'LineToolHighlighter',
];

export const toolGroups = {
    'Trend Lines': [
        'LineToolTrendLine', 'LineToolRay', 'LineToolExtended', 'LineToolInfoLine', 'LineToolTrendAngle'
    ],
    'Shapes': [
        'LineToolRectangle', 'LineToolEllipse', 'LineToolTriangle', 'LineToolRotatedRectangle'
    ],
    'Patterns': [
        'LineToolHeadAndShoulders', 'LineToolTrianglePattern', 'LineToolCypherPattern', 'LineTool5PointsPattern', 'LineToolABCD'
    ],
    'Fibonacci': [
        'LineToolFibRetracement', 'LineToolFibArcs', 'LineToolFibFan', 'LineToolFibChannel', 'LineToolFibCircles',
        'LineToolFibSpeedResistanceArcs', 'LineToolFibSpeedResistanceFan', 'LineToolFibSpiral', 'LineToolFibTimeZone', 'LineToolFibWedge'
    ],
    'Gann Tools': [
        'LineToolGannFan', 'LineToolGannSquare', 'LineToolGannComplex', 'LineToolGannFixed'
    ],
    'Elliott Wave': [
        'LineToolElliottImpulse', 'LineToolElliottCorrection', 'LineToolElliottTriangle', 'LineToolElliottDoubleCombo', 'LineToolElliottTripleCombo'
    ],
    'Annotations': [
        'LineToolText', 'LineToolCallout', 'LineToolNote', 'LineToolTextAbsolute', 'LineToolNoteAbsolute', 'LineToolSignpost'
    ],
    'Measurement and Projections': [
        'LineToolPriceLabel', 'LineToolPriceNote', 'LineToolPriceRange', 'LineToolProjection', 'LineToolRiskRewardLong', 'LineToolRiskRewardShort', 'LineToolFixedRangeVolumeProfile'
    ],
    'Miscellaneous': [
        'LineToolBrush', 'LineToolComment', 'LineToolPath', 'LineToolPrediction', 'LineToolBalloon', 'LineToolBarsPattern', 'LineToolBezierCubic',
        'LineToolBezierQuadro', 'LineToolCircle', 'LineToolCircleLines', 'LineToolDateAndPriceRange', 'LineToolDateRange', 'LineToolDisjointAngle', 
        'LineToolFlagMark', 'LineToolFlatBottom', 'LineToolAnchoredVWAP', 'LineToolGhostFeed', 'LineToolHorzLine', 'LineToolHorzRay', 
        'LineToolInsidePitchfork', 'LineToolParallelChannel', 'LineToolPitchfan', 'LineToolPitchfork', 'LineToolPolyline', 'LineToolSchiffPitchfork', 
        'LineToolSchiffPitchfork2', 'LineToolSineLine', 'LineToolThreeDrivers', 'LineToolTimeCycles', 'LineToolTriangle', 'LineToolVertLine', 
        'LineToolCrossLine', 'LineToolHighlighter'
    ]
};
