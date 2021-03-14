import Head from 'next/head'
import styles from '../styles/Home.module.css'
import QrcodeDecoder from 'qrcode-decoder'
import React, { useState } from 'react'

export default function Home() {

  const qr = new QrcodeDecoder()
  const img = React.createRef()
  const inputFile = React.createRef()
  const [imageData, setImageData] = useState(null)
  const [imageUrl, setImageUrl] = useState('/placeholder.png')
  const [imageChoosen, setImageChoosen] = useState(false);

  async function decodeImage() {
    try {
      const code = await qr.decodeFromImage(img.current)
      const splitedData = code.data.split(';');
      setImageData(code.data)
    } catch (e) {
      setImageData(null)
      alert('Invalid QR Code!')
    }
  }

  function handleImageChange(event) {
    setImageUrl(URL.createObjectURL(event.target.files[0]))
    setImageChoosen(true)
  }

  function chooseImage() {
    inputFile.current.click()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>QR Code Decoder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <img 
          src={imageUrl} 
          ref={img} 
          className={styles.qrcode} />

        <input 
          ref={inputFile}
          type="file" 
          className={styles.hide} 
          onChange={ (event) => handleImageChange(event) } />

        <button 
          onClick={() => chooseImage()}
          className={styles.button}>Choose image</button>

        <button 
          onClick={() => decodeImage()}
          className={imageChoosen ? styles.button : styles.hide}>Decode</button>
        
        <div
          className={
            imageData !== null ? styles.data : styles.hide
          }>{imageData}</div>
      </main>
    </div>
  )
}
