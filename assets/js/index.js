const ToastType = {
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
};

const toastData = {
  [ToastType.SUCCESS]: {
    style: {
      iconClass: "text-green-500 bg-green-100",
      bgColor: "bg-white",
      textColor: "text-gray-500",
    },
    button: {
      element: document.getElementById("successBtn"),
      message: "Cet élement est en succès.",
    },
  },
  [ToastType.WARNING]: {
    style: {
      iconClass: "text-yellow-500 bg-yellow-100",
      bgColor: "bg-white",
      textColor: "text-gray-500",
    },
    button: {
      element: document.getElementById("warningBtn"),
      message: "Cet élément nécessite votre attention.",
    },
  },
  [ToastType.DANGER]: {
    style: {
      iconClass: "text-red-500 bg-red-100",
      bgColor: "bg-white",
      textColor: "text-gray-500",
    },
    button: {
      element: document.getElementById("dangerBtn"),
      message: "Cet élement est en danger.",
    },
  },
};

const lastToastTime = {
  [ToastType.SUCCESS]: 0,
  [ToastType.WARNING]: 0,
  [ToastType.DANGER]: 0,
};

function initToasts() {
  const duration = 3000;
  for (const toastKey in toastData) {
    const btn = toastData[toastKey].button.element;
    if (btn) {
      const type = toastKey;
      const message = toastData[toastKey].button.message;
      btn.addEventListener("click", function () {
        createToast(type, message, duration);
      });
    }
  }
}

function createToast(type, message, duration = 3000, cooldownTime = 2000) {
  // console.log(type, message);
  // Vérification de la validité de cooldownTime
  const defaultCoolDownTime = 2000;
  if (typeof cooldownTime !== "number" || cooldownTime < 2000) {
    console.error(
      "Le cooldownTime doit être un entier et au moins égal à " +
        cooldownTime +
        "."
    );
    cooldownTime = defaultCoolDownTime;
  }
  // Attendre avant d'afficher un nouveau toast du même type
  const now = Date.now();
  if (now - lastToastTime[type] < cooldownTime) {
    return;
  }
  lastToastTime[type] = now;
  // Vérification si le type est valide
  if (!Object.values(ToastType).includes(type)) {
    const errorMsg = `Type de toast invalide : ${type}`;
    console.error(errorMsg);
    createToast(ToastType.DANGER, errorMsg);
    return;
  }
  const defaultDuration = 3000;
  // Vérification de la validité de la durée
  if (typeof duration !== "number" || duration < 2000) {
    console.error(
      "La durée du toast doit être un entier et au moins égal à " +
        duration +
        "."
    );
    duration = defaultDuration;
  }
  // Utiliser le tableau associatif toastStyles pour obtenir les propriétés de style
  const { iconClass, bgColor, textColor } =
    toastData[type].style || toastData.default.style;
  const toast = document.createElement("div");
  const toastId = `toast-${Date.now()}`;
  toast.id = toastId;
  toast.className = `flex items-center justify-between w-full max-w-xs p-4 mb-4 ${textColor} ${bgColor} rounded-lg shadow fixed bottom-4 right-4`;
  const content = `
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${iconClass} rounded-lg mr-2">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span class="sr-only">${type} icon</span>
        </div>
        <div class="ml-3 text-sm font-normal">${message}</div>
        <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#${toastId}" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
  `;
  toast.innerHTML = content;
  document.body.appendChild(toast);
  // Supprimer le toast lorsque l'utilisateur clique sur la croix
  const closeButton = toast.querySelector(
    `[data-dismiss-target="#${toastId}"]`
  );
  closeButton.addEventListener("click", function () {
    toast.remove();
  });
  setTimeout(function () {
    toast.remove();
  }, duration);
}

/*------*/
/* MAIN */
/*------*/

initToasts();
