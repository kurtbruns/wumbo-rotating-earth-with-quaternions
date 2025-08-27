import { QuaternionsSetup } from "./QuaternionsSetup";
import { Rotate90DegreesAroundYAxis } from "./Rotate90DegreesAroundYAxis";
import { Rotate90DegreesAroundXAxis } from "./Rotate90DegreesAroundXAxis";
import { RotateAroundDiagonalAxis } from "./RotateAroundDiagonalAxis";

import { AxisOfRotationCombinedRotations } from "./AxisOfRotationCombinedRotations";
import { AxisOfRotationSmooth } from "./AxisOfRotationSmooth";
import { AxisOfRotationUnitTest1 } from "./AxisOfRotationUnitTest1";
import { AxisOfRotationUnitTest2 } from "./AxisOfRotationUnitTest2";
import { AxisOfRotationCombinedRotationsOtherWay } from "./AxisOfRotationCombinedRotationsOtherWay";
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { CombinedRotations } from "./CombinedRotations";
import { CombinedRotationsOtherWay } from "./CombinedRotationsOtherWay";
import { CombinedRotationsSideBySide } from "./CombinedRotationsSideBySide";
import { CombinedRotationsSideBySideTransition } from "./CombinedRotationsSideBySideTransition";
import { QuaternionMultiplication } from "./QuaternionMultiplication";


new QuaternionsSetup();

new Rotate90DegreesAroundXAxis();

// new Rotate90DegreesAroundYAxis();

new RotateAroundDiagonalAxis();

new CombinedRotations();

new CombinedRotationsSideBySide();

new CombinedRotationsSideBySideTransition();

new CombinedRotationsOtherWay();

new QuaternionMultiplication();


// new AxisOfRotationUnitTest1();
// new AxisOfRotationUnitTest2();
// new AxisOfRotationCombinedRotations();
// new AxisOfRotationCombinedRotationsOtherWay();

// new AxisOfRotationSmooth();