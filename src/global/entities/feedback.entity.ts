import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Photo } from './photo.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  feedback_uuid: string;

  @Column({ default: '' })
  service: string;

  @Column({ default: '' })
  feecback: string;

  @OneToMany(() => Photo, (photo) => photo.feedback_uuid, { cascade: true })
  photos: Photo[];

  @Column({ default: '' })
  email?: string;
}
