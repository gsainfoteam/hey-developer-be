import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('photo')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  photo_uuid: string;

  @Column()
  photo: string;

  @Column()
  feedback_uuid: string;
}
