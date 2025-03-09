import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetMenuDto, MenuDto } from './dtos';
import { GetMenuForm, MenuForm } from './forms';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('menu')
@ApiTags('menu')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  async postMenu(@Body() data: MenuDto, @Request() req) {
    const restaurantId = req.user.sub;
    const { name, price, category, description }: MenuForm = data;

    await this.menuService.createMenu({
      name,
      price,
      category,
      description,
      restaurantId,
    });

    return { message: '메뉴가 성공적으로 등록 되었습니다.' };
  }

  @Get()
  async getManyMenu(@Query() query: GetMenuDto, @Request() req) {
    const restaurantId = req.user.sub;

    const { name, minPrice, maxPrice }: GetMenuForm = query;

    return await this.menuService.findManyMenu({
      name,
      minPrice,
      maxPrice,
      restaurantId,
    });
  }

  @Delete(':id')
  async deleteMenu(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const restaurantId = req.user.sub;

    return await this.menuService.removeMenu({ restaurantId, id });
  }
}
