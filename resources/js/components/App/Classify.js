export default function Classify(num) {
    switch (num) {
        case 0:
            return "Normal (NOR)";

        case 1:
            return "Premature Ventricular Contraction Beat (PVC)";

        case 2:
            return "Paced Beat (PAB)";

        case 3:
            return "Right Bundle Branch Block Beat (RBB)";

        case 4:
            return "Left Bundle Branch Block Beat (LBB)";

        case 5:
            return "Atrial Premature Contraction Beat (APC)";

        case 6:
            return "Ventricular Flutter Wave (VFW)";

        case 7:
            return "Premature Ventricular Contraction Beat (VEB)";

        default:
            return "Unknown";
    }
}
