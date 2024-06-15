export class CreateFeedbackReqDto {
  service: string;
  feedback: string;
  email?: string;
  photos: string[];
}
