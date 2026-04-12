import { IsEmail } from 'class-validator';

export class AddGroupMemberDto {
  @IsEmail()
  memberEmail!: string;
}
