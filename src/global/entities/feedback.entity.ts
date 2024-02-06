import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Photo } from './photo.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryColumn()
  feedback_uuid: string;

  @Column()
  feecback: string;

  @OneToMany(() => Photo, (photo) => photo.feedback_uuid, { cascade: true })
  photos: Photo[];

  @Column()
  email?: string;
}
