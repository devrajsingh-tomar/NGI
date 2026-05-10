import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnswer extends Document {
    attemptId: mongoose.Types.ObjectId;
    questionId: mongoose.Types.ObjectId;
    selectedOptionIds?: mongoose.Types.ObjectId[];
    textResponse?: string;
    fileUrl?: string;
    typingSpeedWPM?: number;
    timeTakenSeconds: number;
    evaluation: {
        isEvaluated: boolean;
        isCorrect?: boolean;
        marksAwarded: number;
        evaluatorId?: mongoose.Types.ObjectId;
        feedback?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
    {
        attemptId: { type: Schema.Types.ObjectId, ref: "Attempt", required: true },
        questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
        selectedOptionIds: [{ type: Schema.Types.ObjectId }],
        textResponse: { type: String },
        fileUrl: { type: String },
        typingSpeedWPM: { type: Number },
        timeTakenSeconds: { type: Number, default: 0 },
        evaluation: {
            isEvaluated: { type: Boolean, default: false },
            isCorrect: { type: Boolean },
            marksAwarded: { type: Number, default: 0 },
            evaluatorId: { type: Schema.Types.ObjectId, ref: "User" },
            feedback: { type: String },
        },
    },
    { timestamps: true }
);

const Answer: Model<IAnswer> = mongoose.models.Answer || mongoose.model<IAnswer>("Answer", AnswerSchema);

export default Answer;
