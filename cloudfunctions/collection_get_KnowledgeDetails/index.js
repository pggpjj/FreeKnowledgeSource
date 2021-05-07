const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = (event, context) => {

    const { userInfo: { openId }, id } = event

    return Promise.all([

        // 如果直接使用微信自带的 _id 索引可直接使用

        // db.collection('articles').doc(id)

        db.collection('articles').where({ id }),

        db.collection('relation').where({

            userId: openId,

            articleId: id,

        }).count()

    ]).then(([details, total]) => {

        // 注意使用 where 查询后这里的 details 是个数组

        if (details.length) {

            return {

                data: {

                    ...details[0],

                    liked: !!total,

                },

                message: 'success',

            }

        }

    }).catch(err => {

        console.error(err)

        return Promise.reject({

            data: {},

            message: err.errMsg,

        })

    })

}