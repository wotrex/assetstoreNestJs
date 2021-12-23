import { BadRequestException, Headers, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards, Inject } from '@nestjs/common';
import { ObjectID } from 'mongodb';
import { Assets } from './assets.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import jwt_decode from "jwt-decode";
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from './categories.service';
import { Categories } from './categories.entity';
import { AssetsService } from './asset.service';
import { ClientProxy } from '@nestjs/microservices';


@Controller('assets')
export class AssetsController {
    constructor(
        private readonly assetsService: AssetsService,
        private readonly userService: UsersService,
        private readonly categService: CategoriesService,
        @Inject('HELLO_SERVICE') private readonly client: ClientProxy
      ) {}
    @Get()
    async getAssets(): Promise<Assets[]> {
        return await this.assetsService.getAssets();
    }
    @Get(':id')
    async getAsset(@Param('id') id): Promise<Assets> {
        const asset = ObjectID.isValid(id) && await this.assetsService.getById(id);
        if (!asset) {
            // Entity not found
            throw new NotFoundException();
        }
        return asset;
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async createAsset(@Body() asset: Partial<Assets>, @Headers() headers): Promise<Assets> {
        if (!asset || !asset.name || !asset.cost) {
            throw new BadRequestException(`An asset must have at least name and cost defined`);
        }
        if(!asset.categories){
            let categ: string[] = ["others"]
            asset.categories = categ;
        }else{
            var i: number = 0;
            let categ: string[] = [];
            for(i = 0; i < asset.categories.length; i++ ){
                let category: Categories = await this.categService.getByName(asset.categories[i]);
                if(category){
                    categ.push(asset.categories[i]);
                }
            }
            asset.categories = categ;
        }
        var decoded = jwt_decode(String(headers.authorization).replace("Bearer ", ""));
        let user: string[] = [(await this.userService.getByUsername(decoded['username'])).id.toString()];
        asset.user = user
        this.client.emit('asset-created', asset)
        return await this.assetsService.save(asset);
    }
    @Put(':id')
    @HttpCode(204)
    async updateAsset(@Param('id') id, @Body() asset: Partial<Assets>): Promise<void> {

        const exists = ObjectID.isValid(id) && await this.assetsService.getById(id);
        if (!exists) {
            throw new NotFoundException();
        }
        if(asset.categories){
            var i: number = 0;
            let categ: string[] = [];
            for(i = 0; i < asset.categories.length; i++ ){
                let category: Categories = await this.categService.getByName(asset.categories[i]);
                if(category){
                    categ.push(asset.categories[i]);
                }
            }
            asset.categories = categ;
        }
        await this.assetsService.update(id, asset);
    }
    @Delete(':id')
    @HttpCode(204)
    async deleteAsset(@Param('id') id): Promise<void> {
        // Check if entity exists
        const exists = ObjectID.isValid(id) && await this.assetsService.getById(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.assetsService.delete(id);
    }

    //@EventPattern('message_printed')
}
