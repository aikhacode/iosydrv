package com.mygama154.gama154driver

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.Toast

class FloatingViewService : Service() {
    private lateinit var windowManager: WindowManager
    private var floatingView: View? = null

    override fun onCreate() {
        super.onCreate()

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        // Inflate custom layout (res/layout/floating_button.xml)
        floatingView = LayoutInflater.from(this).inflate(R.layout.floating_button, null)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )

        params.gravity = Gravity.TOP or Gravity.START
        params.x = 0
        params.y = 200

        // Add view to window
        windowManager.addView(floatingView, params)

        // Example: Handle button click
        floatingView?.findViewById<ImageView>(R.id.bubbleButton)?.setOnClickListener {
            Toast.makeText(this, "Gama Driver..", Toast.LENGTH_SHORT).show()
        }

        // Example: Dragging
        floatingView?.setOnTouchListener(DragTouchListener(windowManager, params))
    }

    override fun onDestroy() {
        super.onDestroy()
        if (floatingView != null) windowManager.removeView(floatingView)
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
