// import dbConnect from '@/lib/dbConnect'
// import ProductModel from '@/lib/models/ProductModel'
// import { NextRequest, NextResponse } from 'next/server'

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params
//     const product = await ProductModel.findById(id).lean()
//     if (!product) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(product, { status: 201 })
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 500 })
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params
//   await dbConnect()

//   try {
//     const deletedProduct = await ProductModel.findByIdAndDelete(id)
//     if (!deletedProduct) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       )
//     }
//     return NextResponse.json({}, { status: 204 })
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 500 })
//   }
// }

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect()

//     const { id } = params
//     const updates = await req.json()

//     const product = await ProductModel.findById(id)
//     if (!product) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       )
//     }

//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       id,
//       { ...product.toObject(), ...updates },
//       { new: true, runValidators: true }
//     )

//     if (!updatedProduct) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(updatedProduct, { status: 200 })
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json(
//       { message: 'Error updating product' },
//       { status: 500 }
//     )
//   }
// }
