import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('photo')
export class Photo {
  @PrimaryColumn({ type: 'uuid' })
  photo_uuid: string;

  @Column()
  photo: string;

  @Column()
  feedback_uuid: string;
}
