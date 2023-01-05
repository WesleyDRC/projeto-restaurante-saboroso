class HcodeGrid {
  constructor(configs) {

    configs.listeners = Object.assign({
        afterUpdateClick: (e) => {
          $("#modal-update").modal("show");
        },
        afterDeleteClick: (e) => {
          window.location.reload();
        },
        afterFormCreate: () => {
          window.location.reload();
        },
        afterFormUpdate: () => {
          window.location.reload();
        },
        afterFormCreateError: () => {
          alert('Não foi possível enviar o formulário!')
        },
        afterFormUpdateError: () => {
          alert('Não foi possível enviar o formulário!')
        }

    }, configs.listeners)

		this.options = Object.assign({}, {
			formCreate: "#modal-create form",
			formUpdate: "#modal-update form",
			btnUpdate: ".btn-update",
			btnDelete: ".btn-delete",
		}, configs)

		this.initForms()

		this.initButtons()
	}

	initForms() {
    this.formCreate = document.querySelector(this.options.formCreate);

    this.formCreate
      .save()
      .then((data) => {
        this.activateEvent('afterFormCreate')
      })
      .catch((error) => {
        this.activateEvent('afterFormCreateError')
      });

    this.formUpdate = document.querySelector(this.options.formUpdate);

    this.formUpdate
      .save()
      .then((data) => {
        this.activateEvent('afterFormUpdate')
      })
      .catch((error) => {
        this.activateEvent('afterFormUpdateError')
      });
	}

  activateEvent(name, args) {
    if(typeof this.options.listeners[name] === "function") this.options.listeners[name].apply(this, args)
  }

  getTrData(e) {
    let tr = e.path.find((el) => {
      return el.tagName.toUpperCase() === "TR";
    });

    return JSON.parse(tr.dataset.row);
  }

	initButtons() {
    [...document.querySelectorAll(this.options.btnUpdate)].forEach((btn) => {
      btn.addEventListener("click", (e) => {

				this.activateEvent('beforeUpdateClick', [e])

        let dataSet = this.getTrData(e)

        for (let name in dataSet) {

          this.options.onUpdateLoad(this.formUpdate, name, dataSet)

        }

        this.activateEvent('afterUpdateClick', [e])
      });
    });

    [...document.querySelectorAll(this.options.btnDelete)].forEach((btn) => {
      btn.addEventListener("click", (e) => {

        let dataSet = this.getTrData(e)

        if (confirm(eval('`' + this.options.deleteMsg + '`')))
          fetch(eval('`' +this.options.deleteUrl + '`'), {
            method: "DELETE",
          })
            .then((resp) => resp.json())
            .then((data) => {
              this.activateEvent("afterDeleteClick")
            });
      });
    });
	}


}
