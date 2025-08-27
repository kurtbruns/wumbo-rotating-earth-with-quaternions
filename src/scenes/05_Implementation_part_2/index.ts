import { IsolateOtherRotation } from "./IsolateOtherRotation";
import { QuaternionVectorProduct } from "./QuaternionVectorProduct";
import { VisualizeTwoRotationsDiagonalAxis } from "./VisualizeTwoRotationsDiagonalAxis";
import { RotateAroundYAxis } from "./RotateAroundYAxis";
import { Vector3 } from '@kurtbruns/vector';
import { IsolateOtherRotationNormalizeCube } from "./IsolateOtherRotationNormalizeCube";
import { DiagonalRotationCubeSplit } from "./DiagonalRotationCubeSplit";
import { DiagonalRotationCubeFull } from "./DiagonalRotationCubeFull";
import { TransformScene } from "./TransformScene";
import { TransformRotateAroundAxis } from "./TransformRotateAroundAxis";
import { TransformDiagonalRotationSplit } from "./TransformDiagonalRotationSplit";
import { TransformDiagonalRotationAllTogether } from "./TransformDiagonalRotationAllTogether";
import { TransformDiagonalRotationSplitXAxis } from "./TransformDiagonalRotationSplitXAxis";
import { TransformDiagonalRotationSplitTheta } from "./TransformDiagonalRotationSplitTheta";
import { TransformDiagonalRotationSplitConjugate } from "./TransformDiagonalRotationSplitConjugate";
import { TransformDiagonalRotationSplitLeftInverse } from "./TransformDiagonalRotationSplitLeftInverse";
import { TransformDiagonalRotationSplitRightInverse } from "./TransformDiagonalRotationSplitRightInverse";
import { TransformDiagonalRotationSplitAddOne } from "./TransformDiagonalRotationSplitAddOne";
import { TransformSetup } from "./TransformSetup";
import { QuaternionIdentity } from "./QuaternionIdentity";
import { ModifyTransform } from "./ModifyTransform";
import { TransformRotateAroundAxisHighlightCubeFace } from "./TransformRotateAroundAxisHighlightCubeFace";
import { RotateAroundUnitCircle } from "./RotateAroundUnitCircle";
import { TransformDiagonalRotationSplitLeft } from "./TransformDiagonalRotationSplitLeft";
import { RotateAroundUnitCircleOtherWay } from "./RotateAroundUnitCircleOtherWay";
import { TransformDiagonalRotationSplitLeftComplete } from "./TransformDiagonalRotationSplitLeftComplete";
import { TransformDiagonalRotationSplitFaster } from "./TransformDiagonalRotationSplitFaster";

new QuaternionIdentity();

new TransformSetup();

new ModifyTransform();

new TransformRotateAroundAxis();

new TransformRotateAroundAxisHighlightCubeFace();

new TransformDiagonalRotationSplit();

// new TransformDiagonalRotationSplitAddOne();

new TransformDiagonalRotationSplitLeft();

new TransformDiagonalRotationSplitLeftInverse();

new TransformDiagonalRotationSplitLeftComplete();

new RotateAroundUnitCircle();

new RotateAroundUnitCircleOtherWay();

new TransformDiagonalRotationSplitRightInverse();

new TransformDiagonalRotationSplitConjugate()

new TransformDiagonalRotationSplitTheta();

new TransformDiagonalRotationSplitFaster();

new TransformDiagonalRotationAllTogether();

new TransformDiagonalRotationSplitXAxis();




// // new VisualizeTwoRotationsDiagonalAxis();

// // new IsolateOtherRotation();

// new IsolateOtherRotationNormalizeCube();

// new DiagonalRotationCubeSplit();

// // new RotateAroundYAxis();

// new DiagonalRotationCubeFull();

new QuaternionVectorProduct();
