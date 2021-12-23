
#include <linux/uinput.h>
#include <fcntl.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <stdlib.h>

void emit(int fd, int type, int code, int val) {
    struct input_event ie;

    ie.type = type;
    ie.code = code;
    ie.value = val;
    /* timestamp values below are ignored */
    ie.time.tv_sec = 0;
    ie.time.tv_usec = 0;

    write(fd, &ie, sizeof(ie));
}

void move_mouse(int fd, int x, int y) {
    emit(fd, EV_REL, REL_X, x);
    emit(fd, EV_REL, REL_Y, y);
    emit(fd, EV_SYN, SYN_REPORT, 0);
}

void click(int fd) {
    emit(fd, EV_KEY, BTN_MOUSE, 1);
    emit(fd, EV_SYN, SYN_REPORT, 0);
    emit(fd, EV_KEY, BTN_MOUSE, 0);
    emit(fd, EV_SYN, SYN_REPORT, 0);
}

void right_click(int fd) {
    emit(fd, EV_KEY, BTN_RIGHT, 1);
    emit(fd, EV_SYN, SYN_REPORT, 0);
    emit(fd, EV_KEY, BTN_RIGHT, 0);
    emit(fd, EV_SYN, SYN_REPORT, 0);
}

void sighandler(int i) {
    (void)i;
    close(0);
}

int main(void) {

    if(getuid()) {
        printf("ERROR: Not running as root!\n");
        exit(1);
    } else {
        printf("[OK] Running as root\nSetting up device...\n");
    }

    struct uinput_setup usetup;
    int i = 50;

    signal(SIGINT, sighandler);
    signal(SIGTERM, sighandler);
    signal(SIGSEGV, sighandler);
    signal(SIGPIPE, SIG_IGN);

    int fd = open("/dev/uinput", O_WRONLY | O_NONBLOCK);

    /* enable mouse button left and relative events */
    ioctl(fd, UI_SET_EVBIT, EV_KEY);
    ioctl(fd, UI_SET_KEYBIT, BTN_LEFT);
    ioctl(fd, UI_SET_KEYBIT, BTN_RIGHT);

    ioctl(fd, UI_SET_EVBIT, EV_REL);
    ioctl(fd, UI_SET_RELBIT, REL_X);
    ioctl(fd, UI_SET_RELBIT, REL_Y);

    ioctl(fd, UI_SET_KEYBIT, KEY_SPACE);

    memset(&usetup, 0, sizeof(usetup));
    usetup.id.bustype = BUS_USB;
    usetup.id.vendor = 0x1234; /* sample vendor */
    usetup.id.product = 0x5678; /* sample product */
    strcpy(usetup.name, "Remote Mouse");

    ioctl(fd, UI_DEV_SETUP, &usetup);
    ioctl(fd, UI_DEV_CREATE);

    /*
        * On UI_DEV_CREATE the kernel will create the device node for this
        * device. We are inserting a pause here so that userspace has time
        * to detect, initialize the new device, and can start listening to
        * the event, otherwise it will not notice the event we are about
        * to send. This pause is only needed in our example code!
        */
    sleep(1);

    /* Wait for input and execute command */
    int running = 1;
    printf("[OK] Waiting for input commands\n");
    while(running) {
            char ev;
            int key, x, y;
            int count = scanf("%c", &ev);
            if (count <= 0 || ev <= 0) {
                break;
            }
            switch (ev) {
            case 'c':
                click(fd);
                break;
            case 'm':
                count = scanf(" %d %d", &x, &y);
                if (count == 2) {
                    move_mouse(fd, x, y);
                }
                break;
            case 'r':
                right_click(fd);
                break;
            case 'q':
                running = 0;
                break;
            }
        }

    /*
        * Give userspace some time to read the events before we destroy the
        * device with UI_DEV_DESTOY.
        */

    ioctl(fd, UI_DEV_DESTROY);
    close(fd);

    return 0;
}