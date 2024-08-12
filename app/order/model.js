const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Invoice = require('../invoice/model')

const orderSchema = Schema({
    status: {
        type: String,
        enum: ['Menunggu Pembayaran', 'Sedang Memproses', 'Dalam Pengiriman', 'Telah Terkirim'],
        default: 'Menunggu Pembayaran'
    },

    delivery_fee: {
        type: Number,
        default: 0
    },

    delivery_address: {
        provinsi: { type: String, required: [true, 'provinsi harus diisi'] },
        kabupaten: { type: String, required: [true, 'kabupaten harus diisi'] },
        kecamatan: { type: String, required: [true, 'kecamatan harus diisi'] },
        kelurahan: { type: String, required: [true, 'kelurahan harus diisi'] },
        detail: {type: String}
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    order_items: []
}, {timestamps: true});

orderSchema.plugin(AutoIncrement, {inc_field: 'order_number'});
orderSchema.virtual('items_count').get(function(){
    return this.order_items.reduce((total, item) => total += (item.price * item.qty), 0)
});
orderSchema.post('save', async function(){
    let sub_total = this.order_items.reduce((total, item) => total += (item.price * item.qty), 0);
    let invoice = new Invoice({
        user: this.user,
        order: this._id,
        sub_total: sub_total,
        delivery_fee: parseInt(this.delivery_fee),
        total: parseInt(sub_total + this.delivery_fee),
        delivery_address: this.delivery_address
    });
    await invoice.save();
});
module.exports = model('Order', orderSchema);