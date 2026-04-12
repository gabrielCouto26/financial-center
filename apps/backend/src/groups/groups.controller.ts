import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SafeUser } from '../users/users.service';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  GroupBalanceResponse,
  GroupDetail,
  GroupsService,
  GroupSummary,
} from './groups.service';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(
    @CurrentUser() user: SafeUser,
    @Body() dto: CreateGroupDto,
  ): Promise<GroupDetail> {
    return this.groupsService.createGroup(user.id, dto.name);
  }

  @Get()
  list(@CurrentUser() user: SafeUser): Promise<GroupSummary[]> {
    return this.groupsService.listForUser(user.id);
  }

  @Get(':groupId')
  detail(
    @CurrentUser() user: SafeUser,
    @Param('groupId') groupId: string,
  ): Promise<GroupDetail> {
    return this.groupsService.getGroupDetail(user.id, groupId);
  }

  @Post(':groupId/members')
  addMember(
    @CurrentUser() user: SafeUser,
    @Param('groupId') groupId: string,
    @Body() dto: AddGroupMemberDto,
  ): Promise<GroupDetail> {
    return this.groupsService.addMember(user.id, groupId, dto.memberEmail);
  }

  @Get(':groupId/balance')
  balance(
    @CurrentUser() user: SafeUser,
    @Param('groupId') groupId: string,
  ): Promise<GroupBalanceResponse> {
    return this.groupsService.getBalance(user.id, groupId);
  }
}
