// src/entities/request-log.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  videoUrl: string;

  @Column()
  proxyInstance: string;

  @CreateDateColumn()
  requestTime: Date;

  @Column()
  status: number;

  @Column({ nullable: true, type: 'text' })
  errorMessage: string;

  @Column()
  responseTime: number;

  @Column('jsonb', { nullable: true })
  proxyConfig: Record<string, any>;

  @Column('jsonb', { nullable: true })
  responseData: Record<string, any>;
}