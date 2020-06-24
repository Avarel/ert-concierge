# Rust
This document was made for future interns who will work on this project and have no idea where to start.

Rust is a relatively new language that has been gaining quite a lot of traction in recent years. Major companies such as Microsoft, Dropbox, Discord, etc. are adopting Rust as the language of choice for high performance systems programming. This project picked Rust (1.44.1) as the tool of choice in order to deliver high performance networking.

## Notes to Future Maintainers
The upload, download, and delete functions are pretty basic. They handle file management correctly (AFAIK), but the uploading could use some work. In particular, multipart forms are a standard way of chopping up and uploading large files in parts, but they are not utilized in this project.

## Why Rust?
Shamelessly stolen from [Nannou](https://nannou.cc/).
* **Super fast**, as in [C and C++ fast](https://benchmarksgame-team.pages.debian.net/benchmarksgame/fastest/rust-gpp.html).
* A **standard package manager** that makes it very easy to handle dependencies and share your own projects in seconds. In fact, running this project takes a `git clone` and a `cargo run --release`.
* **Highly portable**. Easily build for MacOS, Linux, Windows, Android, iOS and so many others. Cross-compilation? No problem.
* **No header files** and no weird linking errors.
* **Sum Types** and **Pattern Matching** and **no NULL**.
* **Local type inference**. Only write types where it matters, no need to repeat yourself.
* A more modern, **functional and expressive style**.
* **Memory safe and data-race-free!** Get your ideas down without the fear of creating pointer spaghetti or segfault time-sinks.
* **Immutability by default**. Easily distinguish between variables that can change and those that can't at a glance.
* **Module system** resulting in very clean and concise name spaces.
* [StackOveflow's most loved language](https://stackoverflow.blog/2020/01/20/what-is-rust-and-why-is-it-so-popular/) for four years in a row.
* One of the kindest internet communities. Please visit mozilla's #rust, /r/rust, or the Rust Discord Server if you're starting out and need any pointers.

## Introduction
The [Rust programming language](https://www.rust-lang.org/) has an [official book in digital form](https://doc.rust-lang.org/stable/book/), which should teach you most of the concepts you need to know to get started on using Rust. If you learn more quickly through trial and error, I recommend trying to make [linked lists](https://rust-unofficial.github.io/too-many-lists/) in Rust, as you will become expose
to ownership concepts extremely quickly.

### Installation
Installation instructions can be found [here](https://www.rust-lang.org/learn/get-started). This project uses the stable 1.44.1 version of Rust.

For developing, I recommend using either:
*  [VSCode](https://code.visualstudio.com/) with the [Rust Analyzer](https://rust-analyzer.github.io/) extension.
* [IntelliJ](https://www.jetbrains.com/) [IDEA](https://www.jetbrains.com/idea/) or [CLion](https://www.jetbrains.com/clion/) with the [Rust plugin](https://intellij-rust.github.io/).

### Ownership
Arguably, ownership and borrowing is the **hardest** concepts you must learn when learning Rust. The rules of ownership are simple:
* Each value in Rust has a variable that’s called its owner.
* There can only be one owner at a time.
* When the owner goes out of scope, the value will be dropped (freed from memory).

You can pass ownership of values around, which is called *moving*.

Of course, having one owner at all times make it impossible to express certain concepts ergonomically. This is where borrowing comes into play: you can borrow variables (as references) from something that owns it. The rules of borrowing are also simple.
* There is either **one** `&mut _` *mutable reference* __OR__ **any number** of  `&_` *immutable references*.
* References must always be valid. This means that references can not *outlive* their owners (no dangling pointers!).

This will arguably be your largest source of frustration when working with Rust. I highly recommend you looking through the book and familiarizing yourself with these concepts if you want to continue working with Rust.

#### Fighting the Borrow Checker
The borrow checker is fickle, and will not allow compilation of programs that violate these ownership and borrowing rules. In exchange, you get benefits such as **no segfaults, dangling pointers, double free, heap buffer overflow,** **iterator invalidation, data races, null poiners, uninitialized memory**. Memory leaks are not prevented (safe programs leak them all the time), but you can **worry less about them**. Best of all, this is done at **compile time** and incurs no performance penalty.

This all done without a runtime (definition pending), so your code is safe (as long as you don't use `unsafe`) and fast (in some cases, faster than C/C++) as it compiles down to regular machine code.

Sometimes, you will want to "fight the borrow checker" because some ideas are
impossible to statically verify. The Rust project maintainers knows this, and
provided useful abstractions that express ownership rules at runtime (a small performance cost, but still less than if you used Java, etc.):
* `Box<_>`: By default, values are allocated on the stack. Box values are allocated on the heap. `Box<usize>` *roughly* correspond to `size_t*`.
* `Rc<_>`: Reference counting, not thread-safe. You can clone an `Rc` to allow
values to have **multiple owners** (technically false, but you should read the 
documentation for more info). This can lead to reference cycles, which results in a 
memory leak. To combat this, you can downgrade `Rc<_>` to a `Weak<_>`.
* `Arc<_>`: Atomic reference counting, thread-safe. Same as `Rc` but uses atomic
numbers, which are more costly.
* `Cell<_>`: Normally, `Rc` and `Arc` only hand out `&_` immutable references. You
can use `Cell` to obtain some interior mutability if the contained type is `Copy`.
* `RefCell<_>`: Allows for full interior mutability. This will error if multiple
functions attempt to obtain a mutable refererence at once. This abstraction expresses borrow rules at runtime.
* `Mutex<_>`: *Basically* a RefCell but thread-safe. It will block the thread until it obtains the lock.
* `RwLock<_>`: Allows for any number of readers OR one writer, thread-safe. It also expresses borrow rules at runtime.

There is a lot more that is covered in the book. Good luck!