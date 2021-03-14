import Head from 'next/head'
import styles from '../styles/Home.module.css'
import QrcodeDecoder from 'qrcode-decoder'
import React, { useState } from 'react'

export default function Home() {

  const mimeTypes = [
    'image/jpeg',
    'image/gif',
    'image/png'
  ];
  
  const qr = new QrcodeDecoder()
  const img = React.createRef()
  const inputFile = React.createRef()
  const [imageData, setImageData] = useState(null)
  const [imageUrl, setImageUrl] = useState('/placeholder.png')
  const [imageChoosen, setImageChoosen] = useState(false)
  const [error, setError] = useState(null)

  async function decodeImage() {
    try {
      const code = await qr.decodeFromImage(img.current)

      if (code.data === undefined || code.data.trim() === '') {
        throw new Error('Invalid QR Code!')
      }

      setImageData(code.data)
    } catch (e) {
      setError(e.message)
    }
  }

  function handleImageChange(event) {
    setError(null)
    setImageData(null)
    const imageDetails = event.target.files[0];

    try {
      if (imageDetails === undefined) {
        throw new Error('Choose a image')
      }
  
      const found = mimeTypes.find(mime => mime === imageDetails.type)
  
      if (!found) {
        throw new Error('Invalid image type')
      }
  
      setImageUrl(URL.createObjectURL(imageDetails))
      setImageChoosen(true)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>QR Code Decoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img 
        src={imageUrl} 
        ref={img} 
        className={styles.qrcode} />

      <input 
        accept={mimeTypes}
        ref={inputFile}
        type="file" 
        className={styles.hide} 
        onChange={ (event) => handleImageChange(event) } />

      <button 
        onClick={() => inputFile.current.click()}
        className={styles.button}>Choose image</button>

      <button 
        onClick={() => decodeImage()}
        className={imageChoosen ? styles.button : styles.hide}>Decode</button>
      
      <div
        className={
          imageData ? styles.data : styles.hide
        }>{imageData}</div>

      <div
        className={
          error ? styles.error : styles.hide
        }>{error}</div>
    </div>
  )
}
