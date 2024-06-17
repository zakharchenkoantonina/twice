const cheerio = require("cheerio");
const axios = require("axios").default;
const _ = require('lodash');
const imageItem = require('../models/entities/ImageItem');
const moment = require('moment');
const mongoosePaginate = require('mongoose-paginate-v2');
const { v4: uuidv4 } = require('uuid');

var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: false,
    },
});
  
module.exports = {
    getGoogleResult: async (param, callback) => {
        try {
            // const searchString = param.searchString;

            await imageItem.deleteMany({ category: 'momo' });
            const crawlerConfig = {
                'twice': ['韓團twice', '트와이스', 'トゥワイス'],
                'nayeon': ['twice Nayeon', 'twice 娜璉', 'twice 임나연', 'twice ナヨン'],
                // 'jeongyeon': ['twice Jeongyeon', 'twice 定延', 'twice 정연', 'twice ジョンヨン'],
                // 'momo': ['twice momo','twice 平井桃', 'twice 모모', 'twice モモ'],
                // 'sana': ['twice Sana', 'twice サナ', 'twice 湊崎紗夏', 'twice 사나'],
                // 'jihyo': ['twice Jihyo', 'twice 志效', 'twice 지효', 'twice ジヒョ'],
                // 'mina': ['twice Mina', 'twice ミナ', 'twice 名井南	', 'twice 미나', 'twice みょうい みな'],
                // 'dahyun': ['twice Dahyun', 'twice 多賢', 'twice 다현', 'twice ダヒョン'],
                // 'chaeyoung': ['twice Chaeyoung', 'twice 彩瑛', 'twice 채영', 'twice チェヨン'],
                // 'tzuyu': ['twice Tzuyu', 'twice 周子瑜', 'twice ツウィ', 'twice 쯔위'],
            }

            await _.each(crawlerConfig, async (v, k) => {
                let category = k;
                let keyWords = v;

                await _.each(keyWords, async (v, k) => {
                    const images = await google.scrape(v, 1000).catch((e)=>console.log(e));
                    console.log('images scraped category : ' + category);
                    console.log('images scraped keyWord : ' + v);

                    let imagelists = [];

                    await _.each(images, (v, k) => {
                        if (v) {
                            let i = 1;

                            let imageItem = {};
                            imageItem.imageItemId = `${moment().unix()}_${moment(new Date()).format('YYYY/MM/DD')}_twice_${uuidv4()}`
                            imageItem.imageItemLink = v.url;
                            imageItem.category = category;
                            imageItem.status = 1;
                            imageItem.createTime = moment(new Date());
                            imageItem.updateTime = moment(new Date());
                            imageItem.remark = '';

                            imagelists.push(imageItem);
                            i++;
                        }

                    })
                    console.log('images boxed');
                    console.log('images inserting ' + imagelists.length);
                    if(imagelists.length !== 0) {
                        await imageItem.insertMany(imagelists, (err) => {

                            console.log(err);
    
                        });
                    }

                    console.log("searching finished")
                })
            })

            callback('', {'msg':'done'});
        } catch (e) {
            console.error(
                `ERROR: An error occurred while trying to getGoogleResult. ${e}`
            );
            callback(e, {'msg':'failed '+ e});
        }
    },
    getImageList: async (query, callback) => {
        try {
            let page = query.page ? query.page : 1;
            let category = query.category ? query.category : 'twice';
            category = category.toLowerCase();
            let offset = 20;

            const options = {
                page: page,
                limit: offset,
                collation: {
                    locale: 'en',
                },
            };

            await imageItem.paginate({ category: category }, options, function (err, result) {
                let imageList = {};

                imageList.data = result.docs;
                imageList.totalPages = result.totalPages;
                imageList.page = result.page;
                imageList.hasNextPage = result.hasNextPage;
                imageList.nextPage = result.nextPage;
                imageList.hasPrevPage = result.hasPrevPage;
                imageList.prevPage = result.prevPage;
                imageList.pagingCounter = result.pagingCounter;
                imageList.category = category;

                callback('', imageList);
            });


        } catch (e) {
            console.error(
                `ERROR: An error occurred while trying to getImageList : ${e}`
            );
            callback('error', 500);
        }
    },
    sleep: (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }


}